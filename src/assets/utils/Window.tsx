const wrappers = {
  navigate: (url: string) => {
    window.location.assign(url);
  },
};

export default wrappers;
