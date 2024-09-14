## Setup
- Install ffmpeg

Whisper setup
```
git clone https://github.com/ggerganov/whisper.cpp.git
# in whisper.cpp dir
bash ./models/download-ggml-model.sh base.en
# if not cuda
make
# if cuda
GGML_CUDA=1 make -j
```
