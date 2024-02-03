class PropertyManager {
       sortByProperty(property) {
        return function (a, b) {
            if (a[property] > b[property])
                return 1;
            else if (a[property] < b[property])
                return -1;

            return 0;
        }
    }

    propertyIsValue(item, property, value) {
        if (item.hasOwnProperty(property) && item[property] === value)
            return true;
        else
            return false;
    }
}