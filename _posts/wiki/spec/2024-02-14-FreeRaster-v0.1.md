---
layout: default
tag: FreeRaster v0.1
categories: wiki spec
title: FreeRaster v0.1 Specifications
---

*in-progress*

# FreeRaster v0.1 Spec

This document describes FRA (Free Raster), an simple file format for the losslessly compressed storage of layered raster images.

While the FRA format can practically store any type of raster image, the main aim of FRA format is to store Pixel Art.

I as the author of this document hereby expect you to have some background knowledge on things like Pixels, Layers, Images and Frames.

In brief, Pixels are made up of `R`, `G`, `B`, `A`, 8-bit values ranging from 0-255, many pixels together make up a Layer, many Layers together make up an Image and many Images together make up an Frame.

