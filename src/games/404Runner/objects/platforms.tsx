

export const platforms = () => {
    const platformWidth = 200;
    const platformHeight = 30;
    const gapBetweenPlatforms = 150;
    const numberOfPlatforms = 3;

    const platformArray = [];

    for (let i = 0; i < numberOfPlatforms; i++) {
        const platformX = Math.random() * (800 - platformWidth);
        const platformY = i * (platformHeight + gapBetweenPlatforms) + 100;

        platformArray.push({ x: platformX, y: platformY, width: platformWidth, height: platformHeight });
    }
    return platformArray;
}