export function bindInput(form, input, onAnswer) {
  form.addEventListener('submit', event => {
    event.preventDefault(); onAnswer(input.value); input.value = ''; input.focus();
  });
}
