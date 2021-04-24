// Adapted from https://stackoverflow.com/questions/34848505/how-to-make-a-loading-animation-in-console-application-written-in-javascript-or

class ConsoleLoader {
    constructor() {
        this.loader = false;
        this.isLoading = false;
    }
    /**
     * Create and display a loader in the console.
     *
     * @param {string} [text=""] Text to display after loader
     * @param {array.<string>} [chars=["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"]]
     * Array of characters representing loader steps
     * @param {number} [delay=100] Delay in ms between loader steps
     * @example
     * let loader = loadingAnimation("Loading…");
     *
     * // Stop loader after 1 second
     * setTimeout(() => clearInterval(loader), 1000);
     * @returns {number} An interval that can be cleared to stop the animation
     */
    start(
        text = "",
        chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
        delay = 100
    ) {
        let x = 0;

        this.loader = setInterval(function() {
            process.stdout.write("\r" + chars[x++] + " " + text);
            x = x % chars.length;
        }, delay);

        this.isLoading = true;
    }

    stop() {
        clearInterval(this.loader);
        this.isLoading = false;
    }
}

module.exports = new ConsoleLoader();
