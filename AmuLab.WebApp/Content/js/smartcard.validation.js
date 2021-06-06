var htmlQuoteRegex = /^[^<>]+$/;
var floatNumberRegex = /^[+]?\d+(\.\d+)?$/;
var integerNumberNotContainZeroRegex = /^\d+$/;
var numberGreaterThanZeroRegex = /^([1-9][0-9]+|[1-9])$/;
var floatNumberGreaterThanZero = /^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$/;
var floatNumberForIngredientMappingRegex = /^([0-9]*\.[0-9]+|[0-9]+|[0-9]*\/[0-9]+)$/;

var MQ = MQ || {};

AntData.BBVP.Validation = {
    ValidateInputNotAllowHtmlTagsNotMessage: function (strValue) {
        if (strValue === undefined || strValue === "")
            return true;
        if (!htmlQuoteRegex.test(strValue)) {
            return false;
        }
        return true;
    },

    ValidateInputNotAllowHtmlTags: function(name, strValue) {
        if (strValue === undefined || strValue === "")
            return true;
        if (!htmlQuoteRegex.test(strValue)) {
            bootbox.alert(name + " không được chứa các ký tự html (< hoặc >).");
            return false;
        }
        return true;
    },

    ValidateTagNotContainHtmlTags: function(tagInput) {
        var tagsItems = $(tagInput).tagsinput("items");

        if (tagsItems.length > 0) {
            for (var i = 0; i < tagsItems.length; i++) {
                var tagName = tagsItems[i];

                if (!htmlQuoteRegex.test(tagName)) {
                    bootbox.alert("Tag không được chứa các ký tự html (< hoặc >).");
                    return false;
                }
            }
        }
        return true;
    },

    ValidateRequireFieldNotMessage: function (elementValue) {
        if (elementValue === undefined || elementValue === null || $.trim(elementValue) === "") {
            return false;
        }
        return true;
    },

    ValidateRequireField: function (name, elementValue) {
        if (elementValue === undefined || elementValue === null || $.trim(elementValue) === "") {
            bootbox.alert(name + " không được để trống.");
            return false;
        }
        return true;
    },

    ValidateMaxlengthInput: function(name, element, intMaxlength) {
        var elementValue = $(element).val();

        if (elementValue === undefined || elementValue === null || $.trim(elementValue) === "" || elementValue.length < intMaxlength) {
            return true;
        } else {
            bootbox.alert(name + " không được nhập quá " + intMaxlength + " kí tự.");
            return false;
        }
    },

    ValidateImageFileExtension: function(imageName) {
        var validExts = new Array(".bmp", ".gif", ".jpg", ".jpeg", ".png", ".tif", ".tiff");
        var fileExt = imageName;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));

        if (validExts.indexOf(fileExt.toLowerCase()) < 0) {
            bootbox.alert(imageName + " không hợp lệ. Chỉ chấp nhận các file bmp, gif, jpg, jpeg, png, tif, tiff.");
            return false;
        }
        return true;
    },

    ValidateFileSize: function(fileName, fileInput, maxsizeInMb) {
        var maxSizeInBytes = parseInt(maxsizeInMb) * 1024 * 1024;
        var fileSize = fileInput.size;

        if (fileSize > maxSizeInBytes) {
            bootbox.alert(fileName + " có kích thước không hợp lệ (> " + maxsizeInMb + "MB).");
            return false;
        }
        return true;
    },

    ValidateImageFile: function(imageName, fileInput, maxsizeinMb) {
        return AntData.BBVP.CommonAction.ValidateImageFileName(imageName) && AntData.BBVP.CommonAction.ValidateFileSize(imageName, fileInput, maxsizeinMb);
    },

    ValidateFromIsSmallerThanToDate: function(fromDate, fromDateName, toDate, toDateName) {
        var startDate = format_Date_ddMMyyyy(fromDate);

        if (startDate === "")
            return true;

        var endDate = format_Date_ddMMyyyy(toDate);

        if (endDate === "")
            return true;

        if (startDate > endDate) {
        	bootbox.alert(fromDateName + " không được lớn hơn " + toDateName + ".");
        	return false;
        }
        return true;
    },

    ValidateIsFloatNumber: function(name, strValue) {
    	if (!floatNumberRegex.test(strValue)) {
    		bootbox.alert(name + " phải là số lớn hơn hoặc bằng 0.");
    		return false;
    	}
    	return true;
    },

    ValidateIsIntegerNumberGreaterThanZero: function(name, strValue) {
    	if (!integerNumberNotContainZeroRegex.test(strValue)) {
    		bootbox.alert(name + " phải là số nguyên lớn hơn hoặc bằng 0.");
    		return false;
    	}
    	return true;
    },

    ValidateNumberGreaterThanZero: function(name, strValue) {
    	if (!numberGreaterThanZeroRegex.test(strValue)) {
    	    bootbox.alert(name + " phải là số nguyên lớn hơn 0 (VD: 123, 234..).");
    		return false;
    	}
    	return true;
    },

    ValidateFloatNumberGreaterThanZero: function(name, strValue) {
        if (!floatNumberGreaterThanZero.test(strValue)) {
    		bootbox.alert(name + " phải là số lớn hơn 0.");
    		return false;
    	}
    	return true;
    },

    ValidateIngredientQuantity : function(name, strValue) {
        if (!floatNumberForIngredientMappingRegex.test(strValue)) {
            bootbox.alert(name + "  phải là số hoặc số thập phân (VD:300, 0.5).");
            return false;
        }
        return true;
    }

}