#!/bin/bash
echo "THIS IS CURRENT WORKING"
current_dir=$(pwd)
cd whisper.cpp
# ./whisper.cpp/main -f "$current_dir/data/processed/creationlabworkshop/creationlabworkshop.wav"
./main -f "../$1"
cd ..
# ./whisper.cpp/main -f samples/jfk.wav