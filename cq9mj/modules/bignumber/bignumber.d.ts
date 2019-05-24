// Type definitions for bignumber.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace BigNumber.prototype{
	// BigNumber.prototype.toFormat.!0
	
	/**
	 * 
	 */
	interface ToFormat0 {
				
		/**
		 * 
		 */
		prefix : string;
				
		/**
		 * 
		 */
		groupSize : number;
				
		/**
		 * 
		 */
		secondaryGroupSize : number;
				
		/**
		 * 
		 */
		groupSeparator : string;
				
		/**
		 * 
		 */
		decimalSeparator : string;
				
		/**
		 * 
		 */
		fractionGroupSize : number;
				
		/**
		 * 
		 */
		fractionGroupSeparator : string;
				
		/**
		 * 
		 */
		suffix : string;
	}
}
declare namespace BigNumber{
	// BigNumber.set.!ret
	
	/**
	 * 
	 */
	interface SetRet {
				
		/**
		 * 
		 */
		DECIMAL_PLACES : number;
				
		/**
		 * 
		 */
		ROUNDING_MODE : number;
				
		/**
		 * 
		 */
		EXPONENTIAL_AT : Array</* number,number */ any>;
				
		/**
		 * 
		 */
		RANGE : Array</* number,number */ any>;
				
		/**
		 * 
		 */
		CRYPTO : boolean;
				
		/**
		 * 
		 */
		MODULO_MODE : number;
				
		/**
		 * 
		 */
		POW_PRECISION : number;
				
		/**
		 * 
		 */
		ALPHABET : string;
				
		/**
		 * 
		 */
		FORMAT : /* BigNumber.prototype.toFormat.!0 */ any;
	}
}
// BigNumber.!ret

/**
 * The sign of the result of pow when x is negative depends on the evenness of n.
 * If +n overflows to ±Infinity, the evenness of n would be not be known.
 */
declare interface Ret {
		
	/**
	 * 
	 */
	 BigNumber;
}

/**
 * The BigNumber constructor and exported function.
 * Create and return a new instance of a BigNumber object.
 * 
 * v {number|string|BigNumber} A numeric value.
 * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
 */
declare interface BigNumber {
		
	/**
	 * 
	 * @param v 
	 * @param b 
	 * @return  
	 */
	new (v : any, b : number): BigNumber;
		
	/**
	 * Return a new BigNumber whose value is the absolute value of this BigNumber.
	 * @return  
	 */
	abs(): BigNumber;
		
	/**
	 * Return
	 *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
	 *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
	 *   0 if they have the same value,
	 *   or null if the value of either is NaN.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	comparedTo(y : BigNumber, b : any): number;
		
	/**
	 * If dp is undefined or null or true or false, return the number of decimal places of the
	 * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
	 * 
	 * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
	 * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
	 * ROUNDING_MODE if rm is omitted.
	 * 
	 * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
	 * @param dp 
	 * @param rm 
	 * @return  
	 */
	dp(dp : any, rm : number): BigNumber;	
	/**
	 * If dp is undefined or null or true or false, return the number of decimal places of the
	 * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
	 * 
	 * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
	 * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
	 * ROUNDING_MODE if rm is omitted.
	 * 
	 * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
	 */
	dp();
		
	/**
	 *  n / 0 = I
	 *  n / N = N
	 *  n / I = 0
	 *  0 / n = 0
	 *  0 / 0 = N
	 *  0 / N = N
	 *  0 / I = 0
	 *  N / n = N
	 *  N / 0 = N
	 *  N / N = N
	 *  N / I = N
	 *  I / n = I
	 *  I / 0 = I
	 *  I / N = N
	 *  I / I = N
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
	 * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	div(y : BigNumber, b : any): BigNumber;
		
	/**
	 * Return a new BigNumber whose value is the integer part of dividing the value of this
	 * BigNumber by the value of BigNumber(y, b).
	 * @param y 
	 * @param b 
	 * @return  
	 */
	idiv(y : any, b : any): BigNumber;
		
	/**
	 * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
	 * 
	 * If m is present, return the result modulo m.
	 * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
	 * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
	 * 
	 * The modular power operation works efficiently when x, n, and m are integers, otherwise it
	 * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
	 * 
	 * n {number|string|BigNumber} The exponent. An integer.
	 * [m] {number|string|BigNumber} The modulus.
	 * 
	 * '[BigNumber Error] Exponent not an integer: {n}'
	 * @param n 
	 * @param m 
	 * @return  
	 */
	pow(n : BigNumber | number, m : BigNumber): BigNumber;
		
	/**
	 * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
	 * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
	 * 
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
	 * @param rm 
	 * @return  
	 */
	integerValue(rm : number): BigNumber;
		
	/**
	 * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
	 * otherwise return false.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	eq(y : BigNumber, b : any): boolean;
		
	/**
	 * Return true if the value of this BigNumber is a finite number, otherwise return false.
	 * @return  
	 */
	isFinite(): boolean;
		
	/**
	 * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
	 * otherwise return false.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	gt(y : BigNumber, b : any): boolean;
		
	/**
	 * Return true if the value of this BigNumber is greater than or equal to the value of
	 * BigNumber(y, b), otherwise return false.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	gte(y : any, b : number): boolean;
		
	/**
	 * Return true if the value of this BigNumber is an integer, otherwise return false.
	 * @return  
	 */
	isInteger(): boolean;
		
	/**
	 * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
	 * otherwise return false.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	lt(y : BigNumber, b : any): boolean;
		
	/**
	 * Return true if the value of this BigNumber is less than or equal to the value of
	 * BigNumber(y, b), otherwise return false.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	lte(y : any, b : number): boolean;
		
	/**
	 * Return true if the value of this BigNumber is NaN, otherwise return false.
	 * @return  
	 */
	isNaN(): boolean;
		
	/**
	 * Return true if the value of this BigNumber is negative, otherwise return false.
	 * @return  
	 */
	isNegative(): boolean;
		
	/**
	 * Return true if the value of this BigNumber is positive, otherwise return false.
	 * @return  
	 */
	isPositive(): boolean;
		
	/**
	 * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
	 * @return  
	 */
	isZero(): boolean;
		
	/**
	 *  n - 0 = n
	 *  n - N = N
	 *  n - I = -I
	 *  0 - n = -n
	 *  0 - 0 = 0
	 *  0 - N = N
	 *  0 - I = -I
	 *  N - n = N
	 *  N - 0 = N
	 *  N - N = N
	 *  N - I = N
	 *  I - n = I
	 *  I - 0 = I
	 *  I - N = N
	 *  I - I = N
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber minus the value of
	 * BigNumber(y, b).
	 * @param y 
	 * @param b 
	 * @return  
	 */
	minus(y : BigNumber, b : number): BigNumber;
		
	/**
	 *   n % 0 =  N
	 *   n % N =  N
	 *   n % I =  n
	 *   0 % n =  0
	 *  -0 % n = -0
	 *   0 % 0 =  N
	 *   0 % N =  N
	 *   0 % I =  0
	 *   N % n =  N
	 *   N % 0 =  N
	 *   N % N =  N
	 *   N % I =  N
	 *   I % n =  N
	 *   I % 0 =  N
	 *   I % N =  N
	 *   I % I =  N
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
	 * BigNumber(y, b). The result depends on the value of MODULO_MODE.
	 * @param y 
	 * @param b 
	 * @return  
	 */
	mod(y : BigNumber, b : any): BigNumber;
		
	/**
	 *  n * 0 = 0
	 *  n * N = N
	 *  n * I = I
	 *  0 * n = 0
	 *  0 * 0 = 0
	 *  0 * N = N
	 *  0 * I = N
	 *  N * n = N
	 *  N * 0 = N
	 *  N * N = N
	 *  N * I = N
	 *  I * n = I
	 *  I * 0 = N
	 *  I * N = N
	 *  I * I = I
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
	 * of BigNumber(y, b).
	 * @param y 
	 * @param b 
	 * @return  
	 */
	times(y : BigNumber, b : any): BigNumber;
		
	/**
	 * Return a new BigNumber whose value is the value of this BigNumber negated,
	 * i.e. multiplied by -1.
	 * @return  
	 */
	negated(): BigNumber;
		
	/**
	 *  n + 0 = n
	 *  n + N = N
	 *  n + I = I
	 *  0 + n = n
	 *  0 + 0 = 0
	 *  0 + N = N
	 *  0 + I = I
	 *  N + n = N
	 *  N + 0 = N
	 *  N + N = N
	 *  N + I = N
	 *  I + n = I
	 *  I + 0 = I
	 *  I + N = N
	 *  I + I = I
	 * 
	 * Return a new BigNumber whose value is the value of this BigNumber plus the value of
	 * BigNumber(y, b).
	 * @param y 
	 * @param b 
	 * @return  
	 */
	plus(y : BigNumber, b : number): BigNumber;
		
	/**
	 * If sd is undefined or null or true or false, return the number of significant digits of
	 * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
	 * If sd is true include integer-part trailing zeros in the count.
	 * 
	 * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
	 * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
	 * ROUNDING_MODE if rm is omitted.
	 * 
	 * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
	 *                     boolean: whether to count integer-part trailing zeros: true or false.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
	 * @param sd 
	 * @param rm 
	 * @return  
	 */
	sd(sd : any, rm : number): BigNumber;	
	/**
	 * If sd is undefined or null or true or false, return the number of significant digits of
	 * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
	 * If sd is true include integer-part trailing zeros in the count.
	 * 
	 * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
	 * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
	 * ROUNDING_MODE if rm is omitted.
	 * 
	 * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
	 *                     boolean: whether to count integer-part trailing zeros: true or false.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
	 */
	sd();
		
	/**
	 * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
	 * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
	 * 
	 * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
	 * @param k 
	 * @return  
	 */
	shiftedBy(k : any): string;
		
	/**
	 *  sqrt(-n) =  N
	 *  sqrt(N) =  N
	 *  sqrt(-I) =  N
	 *  sqrt(I) =  I
	 *  sqrt(0) =  0
	 *  sqrt(-0) = -0
	 * 
	 * Return a new BigNumber whose value is the square root of the value of this BigNumber,
	 * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
	 * @return  
	 */
	sqrt(): BigNumber;
		
	/**
	 * Return a string representing the value of this BigNumber in exponential notation and
	 * rounded using ROUNDING_MODE to dp fixed decimal places.
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
	 * @param dp 
	 * @param rm 
	 * @return  
	 */
	toExponential(dp : any, rm : any): string;
		
	/**
	 * Return a string representing the value of this BigNumber in fixed-point notation rounding
	 * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
	 * 
	 * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
	 * but e.g. (-0.00001).toFixed(0) is '-0'.
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
	 * @param dp 
	 * @param rm 
	 * @return  
	 */
	toFixed(dp : any, rm : any): string;
		
	/**
	 * Return a string representing the value of this BigNumber in fixed-point notation rounded
	 * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
	 * of the format or FORMAT object (see BigNumber.set).
	 * 
	 * The formatting object may contain some or all of the properties shown below.
	 * 
	 * FORMAT = {
	 *   prefix: '',
	 *   groupSize: 3,
	 *   secondaryGroupSize: 0,
	 *   groupSeparator: ',',
	 *   decimalSeparator: '.',
	 *   fractionGroupSize: 0,
	 *   fractionGroupSeparator: '\xA0',      // non-breaking space
	 *   suffix: ''
	 * };
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * [format] {object} Formatting options. See FORMAT pbject above.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
	 * '[BigNumber Error] Argument not an object: {format}'
	 * @param dp 
	 * @param rm 
	 * @param format 
	 * @return  
	 */
	toFormat(dp : BigNumber.prototype.ToFormat0, rm : any, format : /* BigNumber.prototype.toFormat.!0 */ any): string;
		
	/**
	 * Return an array of two BigNumbers representing the value of this BigNumber as a simple
	 * fraction with an integer numerator and an integer denominator.
	 * The denominator will be a positive non-zero value less than or equal to the specified
	 * maximum denominator. If a maximum denominator is not specified, the denominator will be
	 * the lowest value necessary to represent the number exactly.
	 * 
	 * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
	 * 
	 * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
	 * @param md 
	 * @return  
	 */
	toFraction(md : BigNumber): BigNumber;	
	/**
	 * Return an array of two BigNumbers representing the value of this BigNumber as a simple
	 * fraction with an integer numerator and an integer denominator.
	 * The denominator will be a positive non-zero value less than or equal to the specified
	 * maximum denominator. If a maximum denominator is not specified, the denominator will be
	 * the lowest value necessary to represent the number exactly.
	 * 
	 * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
	 * 
	 * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
	 */
	toFraction();
		
	/**
	 * Return the value of this BigNumber converted to a number primitive.
	 * @return  
	 */
	toNumber(): number;
		
	/**
	 * Return a string representing the value of this BigNumber rounded to sd significant digits
	 * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
	 * necessary to represent the integer part of the value in fixed-point notation, then use
	 * exponential notation.
	 * 
	 * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
	 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
	 * @param sd 
	 * @param rm 
	 * @return  
	 */
	toPrecision(sd : any, rm : any): string;
		
	/**
	 * 
	 */
	_isBigNumber : boolean;
	
	/**
	 * 
	 */
	Symbol : {
				
		/**
		 * 
		 */
		toStringTag : string;
	}
		
	/**
	 * 
	 */
	absoluteValue : /* BigNumber.prototype.abs */ any;
		
	/**
	 * 
	 */
	decimalPlaces : /* BigNumber.prototype.dp */ any;
		
	/**
	 * 
	 */
	dividedBy : /* BigNumber.prototype.div */ any;
		
	/**
	 * 
	 */
	dividedToIntegerBy : /* BigNumber.prototype.idiv */ any;
		
	/**
	 * 
	 */
	exponentiatedBy : /* BigNumber.prototype.pow */ any;
		
	/**
	 * 
	 */
	isEqualTo : /* BigNumber.prototype.eq */ any;
		
	/**
	 * 
	 */
	isGreaterThan : /* BigNumber.prototype.gt */ any;
		
	/**
	 * 
	 */
	isGreaterThanOrEqualTo : /* BigNumber.prototype.gte */ any;
		
	/**
	 * 
	 */
	isLessThan : /* BigNumber.prototype.lt */ any;
		
	/**
	 * 
	 */
	isLessThanOrEqualTo : /* BigNumber.prototype.lte */ any;
		
	/**
	 * 
	 */
	modulo : /* BigNumber.prototype.mod */ any;
		
	/**
	 * 
	 */
	multipliedBy : /* BigNumber.prototype.times */ any;
		
	/**
	 * 
	 */
	precision : /* BigNumber.prototype.sd */ any;
		
	/**
	 * 
	 */
	squareRoot : /* BigNumber.prototype.sqrt */ any;
		
	/**
	 * 
	 */
	toJSON : /* BigNumber.prototype.valueOf */ any;
	
	/**
	 * 
	 */
	nodejs : {
		
		/**
		 * 
		 */
		util : {
			
			/**
			 * 
			 */
			inspect : {
								
				/**
				 * 
				 */
				custom : /* BigNumber.prototype.valueOf */ any;
			}
		}
	}
		
	/**
	 * Create and return a BigNumber constructor.
	 * @param configObject 
	 * @return  
	 */
	clone(configObject : any): (v : any, b : number) => void;
		
	/**
	 * 
	 */
	ROUND_UP : number;
		
	/**
	 * 
	 */
	ROUND_DOWN : number;
		
	/**
	 * 
	 */
	ROUND_CEIL : number;
		
	/**
	 * 
	 */
	ROUND_FLOOR : number;
		
	/**
	 * 
	 */
	ROUND_HALF_UP : number;
		
	/**
	 * 
	 */
	ROUND_HALF_DOWN : number;
		
	/**
	 * 
	 */
	ROUND_HALF_EVEN : number;
		
	/**
	 * 
	 */
	ROUND_HALF_CEIL : number;
		
	/**
	 * 
	 */
	ROUND_HALF_FLOOR : number;
		
	/**
	 * 
	 */
	EUCLID : number;
		
	/**
	 * Configure infrequently-changing library-wide settings.
	 * 
	 * Accept an object with the following optional properties (if the value of a property is
	 * a number, it must be an integer within the inclusive range stated):
	 * 
	 *   DECIMAL_PLACES   {number}           0 to MAX
	 *   ROUNDING_MODE    {number}           0 to 8
	 *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
	 *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
	 *   CRYPTO           {boolean}          true or false
	 *   MODULO_MODE      {number}           0 to 9
	 *   POW_PRECISION       {number}           0 to MAX
	 *   ALPHABET         {string}           A string of two or more unique characters which does
	 *                                       not contain '.'.
	 *   FORMAT           {object}           An object with some of the following properties:
	 *     prefix                 {string}
	 *     groupSize              {number}
	 *     secondaryGroupSize     {number}
	 *     groupSeparator         {string}
	 *     decimalSeparator       {string}
	 *     fractionGroupSize      {number}
	 *     fractionGroupSeparator {string}
	 *     suffix                 {string}
	 * 
	 * (The values assigned to the above FORMAT object properties are not checked for validity.)
	 * 
	 * E.g.
	 * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
	 * 
	 * Ignore properties/parameters set to null or undefined, except for ALPHABET.
	 * 
	 * Return an object with the properties current values.
	 * @param obj 
	 * @return  
	 */
	set(obj : any): BigNumber.SetRet;
		
	/**
	 * Return true if v is a BigNumber instance, otherwise return false.
	 * 
	 * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
	 * 
	 * v {any}
	 * 
	 * '[BigNumber Error] Invalid BigNumber: {v}'
	 * @param v 
	 * @return  
	 */
	isBigNumber(v : any): boolean;
		
	/**
	 * Return a new BigNumber whose value is the maximum of the arguments.
	 * 
	 * arguments {number|string|BigNumber}
	 * @return  
	 */
	max(): BigNumber;
		
	/**
	 * Return a new BigNumber whose value is the minimum of the arguments.
	 * 
	 * arguments {number|string|BigNumber}
	 * @return  
	 */
	min(): BigNumber;
		
	/**
	 * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
	 * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
	 * zeros are produced).
	 * 
	 * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
	 * 
	 * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
	 * '[BigNumber Error] crypto unavailable'
	 * @param dp 
	 * @return  
	 */
	random(dp : number): BigNumber;
		
	/**
	 * Return a BigNumber whose value is the sum of the arguments.
	 * 
	 * arguments {number|string|BigNumber}
	 * @return  
	 */
	sum(): BigNumber;
		
	/**
	 * Following IEEE 754 (2008) 6.3,
	 * n - n = +0  but  n - n = -0  when rounding towards -Infinity.
	 */
	s : number;
		
	/**
	 * 
	 */
	e : number;
		
	/**
	 * Zero.
	 */
	c : Array<number>;
		
	/**
	 * 
	 */
	r : number;
}
