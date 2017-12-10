i=0
for file in ./input/*
do
  ./segment 0.5 500 20 "$file" ./output/"$i.ppm"
  let "i += 1"
  rm "$file"
done
