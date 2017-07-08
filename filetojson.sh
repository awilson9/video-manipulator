echo "{\"files\":[" > a.json
for file in *
do
	if [ "$file" != "a.json" ] && [ "$file" != "filetojson.sh" ]  
	then echo "\"$file\", " >> a.json
	fi
done
echo "]}" >> a.json