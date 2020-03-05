export const PLACEHOLDER_CODE = `const swap = (array, i, j) => {
  log("Swapping", array[i], array[j]);
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
};

const bubbleSort = input => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if(input[j - 1] > input[j]) {
        swap(input, j - 1, j);
        debug(input, [j, j - 1]);
      }
    }
  }
  return input;
};

const input = [5,7,3,1,8];
log(">> Input", input);
debug(input);
const result = bubbleSort(input);
log(">> Result", result);
debug(result);

/* Usage Tips:
- Use 'log()' command to print a log line.
- Use 'debug()' command to visualize a variable
- To use Dark Mode, execute this command 'hack.ui.darkMode(true);'
*/`;