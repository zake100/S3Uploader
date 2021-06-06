using AmuLab.Core.Entities;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace AmuLab.Repository
{
    public interface IBaseValueRepository<T> where T : BaseEntity
    {
        T GetById(long id);
        T GetByIdFromDb(long id);
        IList<T> GetByIds(ICollection<long> ids);
        IEnumerable<T> GetAll();
        IList<long> GetAllIdsFromDb();
        long Add(T entity);
        bool Update(T entity);
        long Add(T entity, SqlConnection sqlConnection, IDbTransaction transaction);
        bool Update(T entity, SqlConnection sqlConnection, IDbTransaction transaction);
        bool Delete(T entity);
        long Set(T entity);
        long SetMulti(IEnumerable<T> entities);
        bool DeleteById(long id);
        long DeleteByIds(ICollection<long> ids);
        void DeleteAll();
        List<T> GetBySql(string sql);

    }
}
