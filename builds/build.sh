cp /home/seba/workspace/ML/caripela/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk .
mv app-release-unsigned.apk caripela-unsigned.apk
zipalign -v -p 4 caripela-unsigned.apk caripela-unsigned-aligned.apk 
apksigner sign --ks caripela-key.jks --out caripela-release.apk caripela-unsigned-aligned.apk

