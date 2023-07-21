# Bonjwa r/place pixel data

This repository tracks the current goals of the Bonjwa community on r/place.

Requires pillow and toml, which can be installed using pip: `pip install pillow` and `pip install toml`, or alternatively the Dockerfile can be used to create a preconfigured environment.

There are two steps using the approriate scripts:

```
config.toml -> pixel.json (-> output.png)
```

The config.toml contains information of where each structure is located and the corresponding image, which is used for the pixel values. This image has to be in the correct scale, that means not scaled up.

If you want to filter certain colors, e.g. as a mask, you can add them to the `ignore_colors`. These are matched to the exact RGB values in the image, if a contains an ignored color it is skipped.
