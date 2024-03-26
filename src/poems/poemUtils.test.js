import { hashPoem, getOrAddPoemToDb, capitalizeWords } from './poemUtils';
import BackendApi from '../common/backendApi.js';

jest.mock('../common/backendApi.js');

describe('hashPoem', () => {
  test('returns the first 16 characters of MD5 hash', () => {
    const poem = {
      title: 'Test Title',
      author: 'Test Author'
    };
    const hash = hashPoem(poem);
    // Hash of poem with title 'Test Title' and author 'Test Author' is '4a9ba73904f4f22a'
    expect(hash).toBe('4a9ba73904f4f22a');
    expect(hash).toHaveLength(16);
  });
});

describe('getOrAddPoemToDb', () => {
  beforeEach(() => {
    
      console.log('NODE_ENV:', process.env.NODE_ENV);
    
    



    BackendApi.getPoemById.mockClear();
    BackendApi.getTagsByPoemId.mockClear();
    BackendApi.addPoem.mockClear();
  });

  test('retrieves poem from database if exists', async () => {
    const poem = {
      title: 'Test Title',
      author: 'Test Author'
    };
    BackendApi.getPoemById.mockResolvedValue(poem);
    BackendApi.getTagsByPoemId.mockResolvedValue([]);

    const result = await getOrAddPoemToDb(poem);

    expect(BackendApi.getPoemById).toHaveBeenCalledWith('4a9ba73904f4f22a');
    expect(BackendApi.getTagsByPoemId).toHaveBeenCalledWith('4a9ba73904f4f22a');
    expect(result).toEqual(poem);
  });

  test('adds new poem to database if it does not exist', async () => {
    const poem = {
      title: 'Test Title',
      author: 'Test Author',
      lines: ['Line 1', 'Line 2'],
      lineCount: 2
    };
    const newPoemInDb = { ...poem, id: '456', tags: [] };
    BackendApi.getPoemById.mockRejectedValue('No such poem with id');
    BackendApi.addPoem.mockResolvedValue(newPoemInDb);

    const result = await getOrAddPoemToDb(poem);

    expect(BackendApi.getPoemById).toHaveBeenCalledWith('4a9ba73904f4f22a');
    expect(BackendApi.addPoem).toHaveBeenCalledWith(poem);
    expect(result).toEqual(newPoemInDb);
  });
});

describe('capitalizeWords', () => {
  test('capitalizes the first letter of each word in a phrase', () => {
    const phrase = 'hello world';
    const capitalizedPhrase = capitalizeWords(phrase);
    expect(capitalizedPhrase).toBe('Hello World');
  });

  test('handles empty string', () => {
    const emptyPhrase = '';
    const capitalizedEmptyPhrase = capitalizeWords(emptyPhrase);
    expect(capitalizedEmptyPhrase).toBe('');
  });

  test('handles single-word phrase', () => {
    const singleWord = 'hello';
    const capitalizedSingleWord = capitalizeWords(singleWord);
    expect(capitalizedSingleWord).toBe('Hello');
  });

  test('handles phrase with multiple spaces', () => {
    const phraseWithSpaces = '  hello   world  ';
    const capitalizedPhraseWithSpaces = capitalizeWords(phraseWithSpaces);
    expect(capitalizedPhraseWithSpaces).toBe('  Hello   World  ');
  });
});
