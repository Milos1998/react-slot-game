export async function playTimelineAsync(timeline: gsap.core.Timeline, destroy: boolean) {
    await new Promise<void>((res) => {
        if (timeline.duration() === 0) {
            res();
            return;
        }
        timeline.eventCallback("onComplete", res);
        timeline.play();
    });
    if (destroy) {
        timeline.clear(true);
        timeline.kill();
    }
}
