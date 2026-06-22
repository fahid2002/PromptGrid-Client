export function shouldDismissPopover(container, target) {
  return Boolean(container && target && !container.contains(target));
}

export const isDismissKey = (key) => key === 'Escape';
