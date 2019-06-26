import { WorkClass } from './work-class';

describe('WorkClass', () => {
  it('should create an instance', () => {
    expect(new WorkClass(
      'Amersfoort',
      'A description',
      'Pietje Puk',
      '1970-01-01T00:00:00+00:00',
      {},
      123,
      '1970-01-01T00:00:00+00:00',
      'in_progress',
      'Modemweg',
      'basic',
      '1234 AB',
      'abcd'
    )).toBeTruthy();
  });
});
