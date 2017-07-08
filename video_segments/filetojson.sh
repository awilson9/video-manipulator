echo "[" > a.json
for file in ./*
do
	echo "a " >> a.json
done
echo "]" >> a.json