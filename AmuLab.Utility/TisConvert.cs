using System;

namespace AmuLab.Utility
{
    public class MayquaConverter
    {
        public static int ToInt(object o)
        {
            try
            {
                var result = 0;
                int.TryParse(o.ToString().Replace(",", ""), out result);
                return result;
            }
            catch
            {
                return 0;
            }
        }

        public static Int64 ToInt64(object o)
        {
            try
            {
                Int64 result = 0;
                Int64.TryParse(o.ToString().Replace(",", ""), out result);
                return result;
            }
            catch
            {
                return 0;
            }
        }

        public static float ToFloat(object o)
        {
            try
            {
                float result = 0;
                float.TryParse(o.ToString().Replace(",", ""), out result);
                return result;
            }
            catch
            {
                return 0;
            }
        }

        public static double ToDouble(object o)
        {
            try
            {
                double result = 0;
                double.TryParse(o.ToString().Replace(",", ""), out result);
                return result;
            }
            catch
            {
                return 0;
            }
        }

        public static decimal ToDecimal(object o)
        {
            try
            {
                decimal result = 0;
                decimal.TryParse(o.ToString().Replace(",", ""), out result);
                return result;
            }
            catch
            {
                return 0;
            }
        }

        public static bool ToBool(object o)
        {
            try
            {
                var result = false;
                bool.TryParse(o.ToString(), out result);
                return result;
            }
            catch
            {
                return false;
            }
        }
    }

}
