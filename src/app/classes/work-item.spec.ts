import { WorkItem } from './work-item';

describe('WorkItem', () => {
  it('should create an instance', () => {
    expect(new WorkItem(
      'Amersfoort',
      'A description',
      '1970-01-01T00:00:00+00:00',
      true,
      'Project',
      'City',
      'A description',
      'Pietje Puk',
      12345,
      '1970-01-01T00:00:00+00:00',
      {},
      15000,
      '1970-01-01T00:00:00+00:00',
      'Te plannen',
      'Postweg',
      'Service Koper',
      '1234 AB',
      'B20000'
    )).toBeTruthy();
  });
});
