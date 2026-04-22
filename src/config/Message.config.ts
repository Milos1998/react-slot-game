/**
 * NOTE: would not store layout config inside .ts file if I were doing this without time constraint,
 * but for the sake of speed of work (not needing to load .json config, parse it properly etc.) it's done as is.
 */
export const messages = {
    fps_meter_label: "FPS:",
    gameplay_speed: "ticker speed:",
    gameHeadingLabel: "Wild West 3",
    gameHeadingAuthor: "by Miloš Pavlović",
    gameUi_bet: "Bet",
    gameUi_lines: "Lines",
    gameUi_win: "Win",
    gameUi_balance: "Balance",
    gameUi_spin: "SPIN",
    gameUi_stop: "STOP",
    gameUi_skip: "SKIP",
    gameUi_okLabel: "Ok",
    gameUi_introMessage:
        "Hello, welcome to my slot game!\n\nTo check out different layouts rotate the device, or reduce the size of browser window.\n\nTo change gameplay speed use the toggle in the upper right corner.\n\nTo check out crash recovery you can throttle network to offline and spin the reels.\n\nHave fun!",
} as const;
