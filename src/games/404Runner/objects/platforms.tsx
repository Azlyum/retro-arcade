export const platforms = () => {
  const platformWidth = 200;
  const platformHeight = 30;
  const gapBetweenPlatforms = 50;
  const platformCount = 5;

  const platformArray = [];

  for (let i = 0; i < platformCount; i++) {
    const platformX = Math.random() * (800 - platformWidth);
    const platformY = i * (platformHeight + gapBetweenPlatforms) + 100;

    platformArray.push({
      x: platformX,
      y: platformY,
      width: platformWidth,
      height: platformHeight,
    });
  }
  return platformArray;
};
