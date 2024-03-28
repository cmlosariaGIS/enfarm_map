    // Load Lottie animation when the document is ready
    const animationURL = "https://lottie.host/52133049-24ce-4236-a7c1-0f11d4b03ace/LRglt3SwZv.json";
    const animationContainer = document.getElementById("farmsuccessAnimationCheck");
    const animation = lottie.loadAnimation({
        container: animationContainer,
        renderer: "svg",
        loop: true,
        autoplay: false, // Set to false initially
        path: animationURL,
    });
