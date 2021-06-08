using AmuLab.Core.Entities;
using AmuLab.Core.Exceptions;
using AmuLab.Core.Repository;
using AmuLab.Core.Service;
using System;
using System.Collections.Generic;

namespace AmuLab.Services
{
    public class TmediaService : ServiceBase, ITmediaService
    {
        private readonly ITMediaRepository _repository;

        public TmediaService(ITMediaRepository repository)
        {
            _repository = repository;
        }

        public TMEDIAEntity Add(TMEDIAEntity tMedia)
        {
            if (tMedia == null)
                throw new BadInfoException("The TMedia cannot be null");

            tMedia.MEDIA_CDT = DateTime.Now;

            var addedId = _repository.Add(tMedia);

            if (addedId > 0)
                return tMedia;
            return null;
        }

        public bool Update(TMEDIAEntity tMedia)
        {
            var currentMedia = _repository.GetById(tMedia.MEDIA_ID);

            if (currentMedia == null)
                return false;

            currentMedia.CLCK_CNTR = tMedia.CLCK_CNTR;
            currentMedia.CLCK_LINK_EXTR_IND = tMedia.CLCK_LINK_EXTR_IND;
            currentMedia.CLCK_LINK_IND = tMedia.CLCK_LINK_IND;
            currentMedia.CLCK_LINK_LBL = tMedia.CLCK_LINK_LBL;
            currentMedia.CLCK_LINK_URL = tMedia.CLCK_LINK_URL;
            currentMedia.CMNT_CNTR = tMedia.CMNT_CNTR;
            currentMedia.CMNT_OFF_IND = tMedia.CMNT_OFF_IND;
            currentMedia.DEL_BY_ADM_IND = tMedia.DEL_BY_ADM_IND;
            currentMedia.DEL_BY_ENTY_ID = tMedia.DEL_BY_ENTY_ID;

            //Update more properties
            currentMedia.POST_ID = tMedia.POST_ID;

            return _repository.Update(currentMedia);
        }

        public IEnumerable<TMEDIAEntity> GetAll()
        {
            return _repository.GetAll();
        }

        public bool Delete(int mediaId)
        {
            var currentMedia = _repository.GetById(mediaId);

            if(currentMedia == null)
                throw new BadInfoException("The TMedia doesnot exist in database");

            return _repository.Delete(currentMedia);
        }
    }
}
