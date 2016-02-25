function Item(value) {
    this.value = value;
}

function Matrix() {
    var list = [],
        areas = {},
        colsLength = 0,
        newAreaKey = 0,
        _linkItemWithArea = function(itemIndex, areaIndex) {
            var area = areas[areaIndex],
                item = list[itemIndex];
            if (Array.isArray(area)) {
                item.area = areaIndex;
                if (area.indexOf(itemIndex) === -1) {
                    area.push(itemIndex);
                }
            } else {
                console.error('Area was not found');
            }
        },
        addItemToArea = function(itemIndex, areaIndex) {
            var area;
            if (areaIndex === undefined) {
                area = [];
                areaIndex = ++newAreaKey;
                areas[areaIndex] = area;
            } else {
                area = areas[areaIndex];
            }
            _linkItemWithArea(itemIndex, areaIndex);
        },
        coordsToIndex = function(x, y) {
            if (isNaN(x) || isNaN(y)) {
                console.error('Invalid coordinates');
                return -1;
            }
            return y * colsLength + x;
        },
        indexToCoords = function(index) {
            if(isNaN(index)) {
                console.error('Invalid index');
                return -1;
            }
            return [index % colsLength, Math.floor(index / colsLength)];
        },
        concatAreas = function(areaIndex1, areaIndex2) {
            if (isNaN(areaIndex1) || isNaN(areaIndex2)) {
                return console.error('Cannot concat areas');
            }
            if (areaIndex1 === areaIndex2) {
                return false;
            }
            areas[areaIndex2].forEach(function(index){
                _linkItemWithArea(index, areaIndex1);
            });
            delete areas[areaIndex2];
        }
    return {
        addRow: function(row) {
            if (!Array.isArray(row)) {
                return console.error('Incompatible data type');
            }
            if (colsLength > 0 && colsLength !== row.length) {
                return console.error('Row\'s length should be equal: ', colsLength);
            }
            colsLength = row.length;
            row.forEach(function(el, i){
                var prevItemCol = list[list.length - 1],
                    prevItemRow = null,
                    item = new Item(el);
                list.push(item);
                if (i > 0 && item.value === prevItemCol.value) {
                    addItemToArea(list.length - 1, prevItemCol.area);
                }
                prevItemRow = list[list.length - 1 - colsLength];
                if (prevItemRow && prevItemRow.value === item.value) {
                    addItemToArea(list.length - 1, prevItemRow.area);
                }
                if (!item.area) {
                    addItemToArea(list.length - 1);
                }
                if (prevItemRow && prevItemCol && prevItemRow.value === item.value && prevItemCol.value === item.value) {
                    concatAreas(prevItemRow.area, prevItemCol.area);
                }
            });
        },

        getNeighbours: function(coords) {
            var index = coordsToIndex.apply(null, coords),
                item = list[index],
                area = null;
            if (!item) {
                console.error('Requested item is out of matrix');
                return [];
            }
            area = areas[item.area];
            if (!area) {
                console.error('Something went wrong. Item is out of any area');
            }
            return area.map(indexToCoords);
        }
    };
}

// var m = new Matrix();
// m.addRow([0, 1, 1, 2, 5, 9, 2]);
// m.addRow([4, 7, 1, 1, 1, 5, 8]);
// m.addRow([4, 9, 4, 6, 1, 1, 5]);
// m.addRow([0, 7, 8, 1, 1, 6, 1]);
// m.addRow([3, 8, 2, 1, 1, 6, 5]);
// m.addRow([2, 5, 2, 8, 8, 1, 3]);
// m.addRow([9, 4, 9, 0, 0, 3, 4]);
//
// console.log(m.getNeighbours([4, 1]));
