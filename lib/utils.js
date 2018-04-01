export function takeSnapshotAsync(glView, ...args) {
  if (!glView) {
    throw new Error('GLView not mounted yet!');
  }
  if (!glView.takeSnapshotAsync) {
    throw new Error(
      'GLView.takeSnapshotAsync not implemented - please update Expo to at least SDK 26'
    );
  }
  return glView.takeSnapshotAsync(...args);
}
