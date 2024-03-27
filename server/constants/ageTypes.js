const AgeTypes = {
  KITTEN: {
    RANGE: {
      MIN: 0,
      MAX: 1,
    },
    TYPE: "Kitten",
  },
  JUNIOR: {
    RANGE: {
      MIN: 2,
      MAX: 6,
    },
    TYPE: "Junior",
  },
  MATURE: {
    RANGE: {
      MIN: 7,
      MAX: 10,
    },
    TYPE: "Mature",
  },
  SENIOR: {
    RANGE: {
      MIN: 11,
      MAX: null,
    },
    TYPE: "Senior",
  },
};

module.exports = {
  AgeTypes,
};
