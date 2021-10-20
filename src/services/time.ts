import * as https from 'https';

const getTimeGlobal = async () => {
//   const time: string | string[] = '';
//   const promise = fetch('http://worldtimeapi.org/api/timezone');
//   console.log(promise);
  const url = 'https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Moscow';
  const options = {
    headers: {
      Accept: 'application/json',
    },
  };
  const result = await https.get('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits', options);
  let commits = await JSON.stringify(result);
  console.log(commits);
};
// await https.get(url, options, (res: any) => {
//     console.log(res.data, res.body);
//   });
export { getTimeGlobal };
