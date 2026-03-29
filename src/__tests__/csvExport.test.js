import { generateCSV, downloadCSV } from '../utils/csvExport';

describe('generateCSV', () => {
  test('generates header row', () => {
    const csv = generateCSV([]);
    expect(csv).toContain('Step,Action,Input/Source,Tool,Output,Notes');
  });

  test('generates data rows', () => {
    const rows = [
      { step: 1, action: 'Review', inputSource: 'Doc', tool: 'Excel', output: 'Report', notes: 'N/A' },
    ];
    const csv = generateCSV(rows);
    expect(csv).toContain('1,Review,Doc,Excel,Report,N/A');
  });

  test('wraps fields containing commas in quotes', () => {
    const rows = [
      { step: 1, action: 'Review, check', inputSource: 'Doc', tool: 'Excel', output: 'Report', notes: '' },
    ];
    const csv = generateCSV(rows);
    expect(csv).toContain('"Review, check"');
  });

  test('wraps fields containing double quotes, escaping them', () => {
    const rows = [
      { step: 1, action: 'Say "hello"', inputSource: '', tool: '', output: '', notes: '' },
    ];
    const csv = generateCSV(rows);
    expect(csv).toContain('"Say ""hello"""');
  });

  test('handles empty rows array', () => {
    const csv = generateCSV([]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(1);
  });
});

describe('downloadCSV', () => {
  test('creates and clicks a download link', () => {
    const mockClick = jest.fn();
    const mockAnchor = { href: '', download: '', click: mockClick };
    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    URL.createObjectURL = jest.fn(() => 'blob:test');
    URL.revokeObjectURL = jest.fn();

    downloadCSV([{ step: 1, action: 'A', inputSource: 'B', tool: 'C', output: 'D', notes: '' }], 'test-workflow');

    expect(mockClick).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('test-workflow.csv');
  });
});
