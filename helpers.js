let hasOwnProperty = Object.prototype.hasOwnProperty;
let toString = Object.prototype.toString;

let isObjectLike = (value) => {
  return !!value && typeof value == 'object';
};

let isUndefined = (value) => {
  return typeof result == 'undefined'
};

let isNumber = (value) => {
  return typeof value == 'number' || (isObjectLike(value) && toString.call(value) == '[object Number]')
}

let isString = (value) => {
  return typeof value == 'string' || (isObjectLike(value) && toString.call(value) == '[object String]');
}

let isPlainObject = (value) => {
  var Ctor;

  // Exit early for non `Object` objects.
  if (!(isObjectLike(value) && toString.call(value) == '[object Object]') ||
      (!hasOwnProperty.call(value, 'constructor') &&
        (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
    return false;
  }
  // IE < 9 iterates inherited properties before own properties. If the first
  // iterated property is an object's own property then there are no inherited
  // enumerable properties.
  var result;
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  for (var key in value) { result = key; }
  return typeof result == 'undefined' || hasOwnProperty.call(value, result);
};

export default {
  isPlainObject,
  isObjectLike,
  isNumber,
  isString,
  isUndefined
};
