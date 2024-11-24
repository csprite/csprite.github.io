---
title Building from source
date
last_modified_at
---

### Quick links

1. Setup Your Environment
   - [Setup Windows](#windows)
   - [Setup Linux](#linux)
   - [Setup macOS](#macos)
2. [Install Numpy & Pillow](#install-numpy--pillow)
3. [Pre-Build Instructions](#pre-build-instructions)
3. [Build Instructions](#build-instructions)

## Windows

1. Install Any 1 of the 2 Toolchains:
   1. Install MinGW via [chocolatey](https://docs.chocolatey.org/en-us/choco/setup)
      - `choco install mingw`
   2. Install [Visual Studio](https://visualstudio.microsoft.com/downloads/) or [Visual Studio: Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022).
      - In the 'Visual Studio Installer' ensure the following components are selected to installed, everything else can be completely disabled to save bandwidth:
         - Desktop development with C++
           - C++ AddressSanitizer
           - Clang Compiler For Windows
           - One Of These SDKs:
             - Windows 10 SDK (XX.X.XXXXX.X)
             - Windows 11 SDK (XX.X.XXXXX.X)

3. Install python & git
   - Can be done manually:
     - Install [python](https://www.python.org/)
     - Install [git](https://git-scm.com/downloads)

   - or Use [chocolatey](https://docs.chocolatey.org/en-us/choco/setup)
     - `choco install python git`

   - or Use [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/#install-winget)
     - `winget install -e --id Python.Python.3.9`
     - `winget install -e --id Git.Git`

## Linux

1. Install any 1 of the 2 compiler toolchain listed below:
   - GCC (gcc & g++)
     - Debian & Children: `apt install gcc`
     - Arch & Children: `pacman -S gcc`

   - Clang (clang & clang++)
     - Debian & Children: `apt install clang`
     - Arch & Children: `pacman -S clang`

2. Install any 1 of the 2 build system listed below:
   - Ninja Build
     - Debian & Children: `apt install ninja-build`
     - Arch & Children: `pacman -S ninja`

   - GNU Make
     - Debian & Children: `apt install make`
     - Arch & Children: `pacman -S make`

3. Install **required** dependencies:
   - Arch & Children: `pacman -S git cmake libxrandr libxinerama libx11 libxcursor libxi python3`
   - Debian & Children: `apt install git cmake libxrandr-dev libxrandr2 libxinerama-dev libxinerama1 libx11-dev libx11-6 libxcursor-dev libxcursor1 libxi-dev libxi6 python3 python3-pip`

## macOS

1. Install 1 of any 3 compiler toolchain listed below:
   - Xcode: <https://developer.apple.com/xcode/> (Technically not a toolchain, but can still be used if already installed but other alternatives are much more smaller in size)
   - GCC: `brew install gcc`
   - Clang: as far as i know clang is pre-installed on MacOS

2. Install **required** deps with homebrew:
   - `brew install git cmake python@3.9`

## Install Numpy & Pillow

- Python Package `Pillow` & `numpy` can be installed using various methods:
   - macOS: `homebrew install pillow numpy`
   - Arch & Children: `pacman -S python-numpy python-pillow`
   - Windows & Other: `python -m pip install --upgrade Pillow numpy`

## Pre-Build Instructions

1. Clone csprite Repository: `git clone https://github.com/csprite/csprite --recursive`
2. Move Into Cloned Repository Folder: `cd csprite`
3. Generate Icons & Assets:
   - Icons: `python tools/create_icons.py`
   - Assets: `python tools/create_assets.py`
4. Build Csprite using [Build Instructions](#build-instructions) & you should have your final binary/package in a folder name on of the following: `Release`, `RelWithDebInfo` or `Debug`.

## Build Instructions

these instructions are used for build SDL2 & Csprite.

1. Generate Build Files: `cmake -S ./ -B ./build/ <other-options>`
   - `-DCMAKE_BUILD_TYPE=Release`, all possible values:
     - `Debug`
     - `Release`
     - `RelWithDebInfo`
   - `-G` option specifies the generator to use.
     - On Linux, you can use `-G "Ninja"` or `-G "Unix Makefiles"`.
     - On MacOS, you can use: `-G "Xcode"` or `-G "Unix Makefiles"`.
     - On Windows, you can use: `-G "MinGW Makefiles"` or If you installed Visual Studio you can use the following generators:
       - you can specify the Visual Studio generator depending on the version of Visual Studio you installed, possible values are:
         - `Visual Studio 17 2022`
         - `Visual Studio 16 2019`
         - `Visual Studio 15 2017`
         - `Visual Studio 14 2015`
   - `-T "ClangCL"` flag specifies the toolset to use, this is meant for Windows (Visual Studio only) & is used to Compile using Clang since MSVC is dumb.
   - `-A` flag specifies the platform you are building the library for & this flag is only used on Window.
     - use `-A "x64"` for x64/x86_64 platform.
     - use `-A "Win32"` for x86/i686 platform.
   - `-DCMAKE_OSX_ARCHITECTURES=x86_64` flag specifies the Mac CPU Architecture to build for.
     - use `arm64` for Apple Silicon M1 or M2 (or new CPUs apple might introduce with arm64 architecture).
     - use `x86_64` for Apple CPUs with x64 or x86_64 architecture, this can be used with Apple's M1 & M2 chips since they can run x64 binaries too.
   - `-DBUILD_APPLE_BUNDLE=ON` flag specifies wether to build a Apple's `.app` bundle or not, by default the value is `OFF`.

2. Build The Code With Generated Build Files: `cmake --build ./build/ <other-options>`
   - `--config Release` flag specifies the build configuration to build for, the value should be same as the value of `-DCMAKE_BUILD_TYPE` flag above.
   - `--parallel 4` flag specifies the number of jobs while building, the value should be set to your number of CPU Cores & if affects your systems performance set the value to something lower.

