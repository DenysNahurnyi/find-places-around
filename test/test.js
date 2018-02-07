const common = require('../commonFunctions/commonFunctions')
const validators = require('../commonFunctions/validations')

describe('Validators', () => {
    test('Process coordinate cut off last part', () => {
      expect(validators.processCoordinate('34.2222222222')).toEqual('34.222222');
    });
    test('Process coordinate not equal to number', () => {
        expect(validators.processCoordinate('34.2222222')).not.toEqual(34.22);
    });
    test('Process name', () => {
        expect(validators.processName('museum', 'venue')).toEqual('hello');
    });
    // and so on...
});