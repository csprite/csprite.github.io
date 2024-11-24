---
title Building from source
date
last_modified_at
---

1. Setup Your Environment
   - [Setup Windows](#windows)
   - [Setup Linux](#linux)
   - [Setup macOS](#macos)

2. Build & Install Required Libraries
   - [Build & Install SDL2](#build--install-sdl2)
   - [Install Numpy & Pillow](#install-numpy--pillow)

3. [Build csprite](#build-csprite)

## Windows

1. install [Visual Studio]([https://www.msys2.org/](https://visualstudio.microsoft.com/downloads/)) or [Visual Studio: Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022).
2. whichever version of Visual Studio you install make sure the following components are selected to installed, everything else can be completely disabled to save bandwidth:
   - Desktop development with C++
     - C++ AddressSanitizer
     - Clang Compiler For Windows
     - One Of These SDKs:
       - Windows 10 SDK (XX.X.XXXXX.X)
       - Windows 11 SDK (XX.X.XXXXX.X)

3. install [python](https://www.python.org/) since few scripts depend on them.
4. install [git](https://git-scm.com/downloads) to clone repositories.

## Linux

1. install any compiler toolchain:
   - GCC: GNU Compiler Collection
     - Debian & Children: `apt install gcc` (g++ should be automatically installed by installing gcc)
     - Arch & Children: `pacman -S gcc` (g++ comes with gcc)

   - Clang: C language family frontend for LLVM
     - Debian & Children: `apt install clang` (clang++ comes with clang)
     - Arch & Children: `pacman -S clang` (clang++ comes with clang)

2. install any build system:
   - Ninja Build
     - Debian & Children: `apt install ninja-build`
     - Arch & Children: `pacman -S ninja`

   - GNU Make
     - Debian & Children: `apt install make`
     - Arch & Children: `pacman -S make`

3. install Other Dependencies:
   - Arch & Children: `pacman -S git cmake sdl2 python3`
   - Debian & Children: `apt install git cmake libsdl2-2.0-0 libsdl2-dev python3 python3-pip`
     - SDL2 on Debian & Children's Repository are very old and csprite requires SDL2 v2.0.17 or greater, so you will need to build & install it yourself from source

## macOS

1. install a compiler toolchain:
   - Xcode: https://developer.apple.com/xcode/
   - GCC: GNU Compiler Toolchain: `brew install gcc`
   - Clang: C language family frontend for LLVM: as far as i know clang is pre-installed on MacOS

2. install other deps with homebrew:
   - `brew install git cmake sdl2 python@3.9`

## Build & Install SDL2

this step is required on [Window](#windows) or Debian & Debian based linux distributions since the package is either too old or isn't available at all (like on windows).

1. Get SDL2 v2.26.5 Source Code: `git clone https://github.com/libsdl-org/SDL/ -b release-2.26.5`
2. Move into newly cloned directory & Generate Build Files:
   - `cd SDL/`
   - Build & Install using these [Build & Install Instructions](#build--install-instructions)

## Install Numpy & Pillow

- Python Package `Pillow` & `numpy` can be installed using various methods:
   - Python PIP: `python -m pip install --upgrade Pillow numpy` (Works where-ever pip is installed, which comes installed with python on Arch, Homebrew & Windows on Debian & Children you will need to install `python3-pip` (already done in setup).
   - Homebrew: `homebrew install pillow numpy`
   - Arch & Children: `pacman -S python-numpy python-pillow`

## Build & Install Instructions

these instructions are used for build SDL2 & Csprite.

1. Generate Build Files: `cmake -S ./ -B ./build/ <other-options>`
   - `-DCMAKE_BUILD_TYPE=Release` this option enables all sorts of optimizations & stuff is recommended if you're building for daily use, other possible values are: `RelWithDebInfo` & `Debug`.
   - `-G` option specifies the generator to use.
     - On Linux, you can use `-G "Ninja"` (recomendded) or `-G "Unix Makefiles"`.
     - On MacOS, you can use: `-G "Xcode"` (recomendded) or `-G "Unix Makefiles"`.
     - On Windows, since you install Visual Studio you can use the following generators:
       - you can specify any of the follow Visual Studio generators, depending on the version of Visual Studio you installed: `Visual Studio 17 2022`, `Visual Studio 16 2019`, `Visual Studio 15 2017` & `Visual Studio 14 2015`
   - `-T "ClangCL"` flag specifies the toolset to use, this is meant for Windows & is used to Compile using Clang since it doesn't have weird rules & regulations like MSVC.
   - `-A` flag specifies the platform you are building the library for & this flag is only used on Window.
     - use `-A "x64"` for x64 or x86_64 platform.
     - use `-A "Win32"` for x86 or i686 platform.
   - `-DCMAKE_OSX_ARCHITECTURES=x86_64` flag specifies the Mac CPU Architecture to build for.
     - use `arm64` for Apple Silicon M1 or M2 (or new CPUs apple might introduce with arm64 architecture).
     - use `x86_64` for Apple CPUs with x64 or x86_64 architecture, this can be used with Apple's M1 & M2 chips since they can run x64 binaries too.
   - `-DBUILD_APPLE_BUNDLE=ON` flag specifies wether to build a Apple's `.app` bundle or not, by default the value is `OFF`.

2. Build The Code With Generated Build Files: `cmake --build ./build/ <other-options>`
   - `--config Release` flag specifies the build configuration to build for, the value should be same as the value of `-DCMAKE_BUILD_TYPE` flag above.
   - `--parallel 4` flag specifies the number of jobs while building, the value should be set to your number of CPU Cores & if it causes it to lag set the value to something smaller.

3. Install: `sudo cmake --install ./build/ --strip`
   - `--config Release` flag is same as the flag in step 2.
   - this step should be only used when building a library and will require administrative permissions, so on linux you might need to use `sudo` and on windows you will need to run your terminal "Run as administrator".

## Build Csprite

1. Clone Csprite Repository: `git clone https://github.com/pegvin/csprite --recursive`
2. Move Into Cloned Repository Folder: `cd csprite`
3. Generate Icons & Assets:
   - Icons: `python tools/create_icons.py`
   - Assets: `python tools/create_assets.py`
4. Build Csprite using [Build & Install Instructions](#build--install-instructions) & you should have your final binary/package in a folder name on of the following: `Release`, `RelWithDebInfo` or `Debug`.
