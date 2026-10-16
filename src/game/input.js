export function bindInput(form, input, onAnswer) {
  const submit = event => {
    event.preventDefault();
    if (input.disabled) return;
    const correct = onAnswer(input.value);
    if (correct) input.value = '';
    else input.select();
    input.focus({ preventScroll: true });
  };
  form.addEventListener('submit', submit);
  return () => form.removeEventListener('submit', submit);
}
