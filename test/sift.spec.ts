import { sift, All, match } from '../src/sift';
import { Filter } from '../src/types';

const EXAMPLE_TINY = {
  version: 8121,
  static: true
};

const EXAMPLE_SMALL = {
  name: 'John',
  age: 30,
  city: 'New York',
  email: 'john@example.com',
};

const EXAMPLE_MEDIUM = {
  user: {
    name: 'Alice',
    age: 28,
    address: {
      city: 'Los Angeles',
      state: 'CA'
    }
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
};

const EXAMPLE_LARGE = {
  userName: 'Alice',
  userEmail: 'alice@example.com',
  userAge: 28,
  userProfile: {
    userName: 'Alice_Profile',
    userBio: 'Enthusiast of tech',
  },
  settings: {
    theme: 'light',
    language: 'English'
  }
};

describe('no filters', () => {
  it('empty when no filters', () => {
    const source = structuredClone(EXAMPLE_TINY);

    const result = sift(source);

    expect(result).toEqual({});
  });
});

describe('All filter', () => {
  it('all keys when filter is All', () => {
    const source = structuredClone(EXAMPLE_TINY);

    const result = sift(source, All);

    expect(result).toEqual(source);

    expect(result === source).toEqual(false);
  });
});

describe('string array filter', () => {

  it('source object based on provided filter arrays', () => {
    const source = structuredClone(EXAMPLE_SMALL);
    const result = sift(source, ['name', 'age']);
    expect(result).toEqual({ name: 'John', age: 30 });

  });

  it('source object with missing keys', () => {
    const source = structuredClone(EXAMPLE_SMALL);
    const result = sift(source, ['name', 'occupation']);
    expect(result).toEqual({ name: 'John' });
  });

  it('empty source object', () => {
    const source = {};
    const result = sift(source, ['name', 'age']);
    expect(result).toEqual({});
  });

  it('empty filter arrays', () => {
    const source = structuredClone(EXAMPLE_SMALL);
    const result = sift(source, []);
    expect(result).toEqual({});
  });
});

describe('object filter', () => {
  it('filters nested object properties based on object filter', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter = {
      user: {
        address: ['city']
      }
    };

    const result = sift(source, filter);
    expect(result).toEqual({
      user: {
        address: {
          city: 'Los Angeles'
        }
      }
    });
  });

  it('ignores non-existent keys', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter = {
      nonExistentKey: ['someProperty']
    };

    const result = sift(source, filter);
    expect(result).toEqual({});
  });

  it('applies multiple nested object filters', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter = {
      user: ['name', 'age'],
      settings: ['theme']
    };

    const result = sift(source, filter);
    expect(result).toEqual({
      user: {
        name: 'Alice',
        age: 28
      },
      settings: {
        theme: 'dark'
      }
    });
  });

  it('deals with empty object filter correctly', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter = {};

    const result = sift(source, filter);
    expect(result).toEqual({});
  });

  it('retains entire nested object when filter is specified as All', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter: Filter = {
      user: ['name', 'age'],
      settings: All
    };

    const result = sift(source, filter);
    expect(result).toEqual({
      user: {
        name: 'Alice',
        age: 28
      },
      settings: source.settings
    });
  });

  it('filters deeply nested properties', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter = {
      user: {
        address: ['state']
      }
    };

    const result = sift(source, filter);
    expect(result).toEqual({
      user: {
        address: {
          state: 'CA'
        }
      }
    });
  });

  it('handles complex nested structures with multiple filters', () => {
    const source = structuredClone(EXAMPLE_MEDIUM);
    const filter: Filter = {
      user: {
        name: All,
        address: {
          city: All
        }
      },
      settings: {
        notifications: All
      }
    };

    const result = sift(source, filter);
    expect(result).toEqual({
      user: {
        name: source.user.name,
        address: {
          city: source.user.address.city
        }
      },
      settings: {
        notifications: source.settings.notifications
      }
    });
  });
});

describe('match filter', () => {
  it('filters properties by key pattern', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/^user[A-Z]/));
    expect(result).toEqual({
      userName: 'Alice',
      userEmail: 'alice@example.com',
      userAge: 28
    });
  });

  it('includes nested properties if matching key pattern', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/Profile$/));
    expect(result).toEqual({
      userProfile: {
        userName: 'Alice_Profile',
        userBio: 'Enthusiast of tech'
      }
    });
  });

  it('works with All filter combined with key pattern', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/^user/, All));
    expect(result).toEqual({
      userName: 'Alice',
      userEmail: 'alice@example.com',
      userAge: 28,
      userProfile: {
        userName: 'Alice_Profile',
        userBio: 'Enthusiast of tech'
      }
    });
  });

  it('returns empty object if no keys match the pattern', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/xyz$/));
    expect(result).toEqual({});
  });

  it('excludes properties if filters within match are restrictive', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/^user/, ['userEmail']));
    expect(result).toEqual({
      userEmail: 'alice@example.com'
    });
  });

  it('filters using complex regular expressions', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/^(user|settings)/));
    expect(result).toEqual({
      userName: 'Alice',
      userEmail: 'alice@example.com',
      userAge: 28,
      userProfile: {
        userName: 'Alice_Profile',
        userBio: 'Enthusiast of tech'
      },
      settings: {
        theme: 'light',
        language: 'English'
      }
    });
  });

  it('applies nested matches within larger structure', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/User/, {
      userProfile: match(/Name$/)
    }));
    expect(result).toEqual({
      userName: 'Alice',
      userProfile: {
        userName: 'Alice_Profile'
      }
    });
  });

  it('applies nested matches within larger structure with All filter', () => {
    const source = structuredClone(EXAMPLE_LARGE);
    const result = sift(source, match(/User/, {
      userProfile: match(/Name$/),
      All
    }));

    expect(result).toEqual({
      userName: 'Alice',
      userEmail: 'alice@example.com',
      userAge: 28,
      userProfile: {
        userName: 'Alice_Profile'
      }
    });

  });
});
