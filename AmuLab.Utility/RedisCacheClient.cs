using StackExchange.Redis;
using StackExchange.Redis.Extensions.Core;
using StackExchange.Redis.Extensions.Newtonsoft;
using System;
using System.Collections.Generic;
using System.Configuration;

namespace AmuLab.Utility
{
    public class RedisCacheClient : AmuLab.Core.Utility.ICacheClient
    {
        private static volatile ISerializer _serializer;
        private static bool IsUserRedis = Convert.ToBoolean(ConfigurationManager.AppSettings["IsUseRedis"] ?? "true");
        public RedisCacheClient()
        {
            _serializer = new NewtonsoftSerializer();
        }

        public void SetIsUseRedis(bool isUserRedis)
        {
            IsUserRedis = isUserRedis;
        }

        public bool Exists(string key)
        {
            if (IsUserRedis)
            {
                try
                {
                    var redisClient = RedisWriteClient.CurrentConnection;
                    var trans = redisClient.CreateTransaction();
                    var obj = trans.KeyExistsAsync(key);
                    trans.Execute();

                    return obj.Result;
                }
                catch
                {
                    return false;
                }
            }
            return false;
        }

        public bool Remove(string key)
        {
            if (IsUserRedis)
            {
                try
                {
                    var redisClient = RedisWriteClient.CurrentConnection;
                    var trans = redisClient.CreateTransaction();
                    var obj = trans.KeyDeleteAsync(key);

                    trans.Execute();
                    return obj.Result;
                }
                catch
                {
                    return false;
                }
            }
            return false;
        }

        public bool Set(string key, object o)
        {
            if (IsUserRedis)
            {
                try
                {
                    if (Exists(key))
                    {
                        Remove(key);
                    }

                    var redisClient = RedisWriteClient.CurrentConnection;
                    var trans = redisClient.CreateTransaction();

                    trans.StringSetAsync(key, _serializer.Serialize(o));

                    return trans.Execute();
                }
                catch (Exception)
                {
                    return false;
                }
            }
            return false;
        }

        public T Get<T>(string key)
        {
            if (IsUserRedis)
            {
                try
                {
                    var redisClient = RedisWriteClient.CurrentConnection;
                    var trans = redisClient.CreateTransaction();
                    var obj = trans.StringGetAsync(key);

                    trans.Execute();

                    if (obj.Result.HasValue)
                    {
                        var result = _serializer.Deserialize<T>((byte[])obj.Result);
                        return result;
                    }
                    return default(T);
                }
                catch
                {
                    return default(T);
                }
            }
            return default(T);
        }

        public void Dispose()
        {
            RedisWriteClient.Current.GetConnection.Dispose();
        }

        public IDictionary<string, T> GetAll<T>(IEnumerable<string> keys)
        {
            throw new NotImplementedException();
        }

        public void RemoveAll(IEnumerable<string> keys)
        {
            if (IsUserRedis)
            {
                try
                {
                    var redisClient = RedisWriteClient.CurrentConnection;
                    var trans = redisClient.CreateTransaction();
                    
                    foreach (var key in keys)
                    {
                        trans.KeyDeleteAsync(key);
                    }
                    
                    trans.Execute();
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public void FlushDb()
        {
            if (IsUserRedis)
            {
                try
                {
                    RedisWriteClient.FlushDb();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }

    public sealed class RedisWriteClient
    {
        private static readonly string ServerIp = ConfigurationManager.AppSettings["RedisHostMaster"];
        private static readonly string RedisDb = ConfigurationManager.AppSettings["RedisDbServer"] ?? "7";
        private const string Password = "";
        private const int IoTimeOut = 50000;
        private const int SyncTimeout = 50000;

        private static SocketManager _socketManager;
        private ConnectionMultiplexer _connection;
        private static volatile RedisWriteClient _instance;

        public static readonly object SyncLock = new object();
        public static readonly object SyncConnectionLock = new object();

        public static RedisWriteClient Current
        {
            get
            {
                if (_instance != null) return _instance;

                lock (SyncLock)
                {
                    if (_instance == null)
                    {
                        _instance = new RedisWriteClient();
                    }
                }
                return _instance;
            }
        }

        private RedisWriteClient()
        {
            _socketManager = new SocketManager(GetType().Name);
            _connection = GetNewConnection();
        }

        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() => {
            var config = ConfigurationOptions.Parse(ServerIp);
            config.KeepAlive = 5;
            config.SyncTimeout = SyncTimeout;
            config.AbortOnConnectFail = false;
            config.AllowAdmin = true;
            config.ConnectTimeout = IoTimeOut;
            config.SocketManager = _socketManager;
            config.AbortOnConnectFail = false;
            return ConnectionMultiplexer.Connect(config);
        });

        private static ConnectionMultiplexer GetNewConnection()
        {
            var config = ConfigurationOptions.Parse(ServerIp);
            config.KeepAlive = 5;
            config.SyncTimeout = SyncTimeout;
            config.AbortOnConnectFail = false;
            config.AllowAdmin = true;
            config.ConnectTimeout = IoTimeOut;
            config.SocketManager = _socketManager;
            var connection = ConnectionMultiplexer.ConnectAsync(config);
            var muxer = connection.Result;
            return muxer;
        }

        public static ConnectionMultiplexer GetConnectionLazy
        {
            get
            {
                return lazyConnection.Value;
            }
        }

        public ConnectionMultiplexer GetConnection
        {
            get
            {
                lock (SyncConnectionLock)
                {
                    if (_connection == null)
                        _connection = GetNewConnection();
                    if (!_connection.IsConnected)
                        _connection = GetNewConnection();

                    if (_connection.IsConnected)
                        return _connection;
                    return _connection;
                }
            }
        }
        public static IDatabase CurrentConnection
        {
            get
            {
                var connection = GetConnectionLazy.GetDatabase(Convert.ToInt32(RedisDb));
                return connection;
            }
        }

        public static IDatabase CurrentConnectionWithDb(int redisDb)
        {
            return GetConnectionLazy.GetDatabase(redisDb);
        }


        public static void FlushDb()
        {
            var connection = GetNewConnection();
            var server = connection.GetServer("localhost");
            server.FlushDatabase(Convert.ToInt32(RedisDb));
        }
    }
}
