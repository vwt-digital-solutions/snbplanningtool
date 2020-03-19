import { WorkItem } from './work-item';

describe('WorkItem', () => {
  it('should create an instance', () => {
    expect(new WorkItem(
      'Amersfoort',
      'A description',
      'Pietje Puk',
      '102415',
      '1970-01-01T00:00:00+00:00',
      {},
      123,
      '1970-01-01T00:00:00+00:00',
      'in_progress',
      'Modemweg',
      'basic',
      '1234 AB',
      'abcd',
      {}
    )).toBeTruthy();
  });
});
