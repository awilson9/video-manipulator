import java.io.File;
import java.awt.Image;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

public class SpriteSheet {
	public static void main(String[] args){
		if (args.length!=5){
			System.out.println("Please run with 5 command line arguments filepath of input folder, name of sprite sheet to create, length of images in file, width, num images in directory");
			System.exit(0);
		}

		String folderPath = args[0];
		String outputFile = args[1];
		int width = Integer.parseInt(args[2]);
		int height = Integer.parseInt(args[3]);
		int numImages = Integer.parseInt(args[4]);
	

		BufferedImage outImage = new BufferedImage(numImages*width, height, BufferedImage.TYPE_INT_ARGB);
		
		int widthStart = 0;
		File dir = new File(folderPath);
		File[] directoryListing = dir.listFiles();
		if (directoryListing != null) {
			for (File child : directoryListing) {
				if(!child.isHidden()){
				writeImage(readImage(child), outImage, widthStart, width, height);
				widthStart+=width;
			}
			}

		    //write to file
			File out = new File(outputFile + ".png");
			try{
			ImageIO.write(outImage, "png", out);
			}
			catch(Exception e){
				e.printStackTrace();
			}
		} else {
			System.out.println("No directory found with name " + args[0]);
		}
	}

	public static BufferedImage readImage(File file){
		BufferedImage img = null;

		try 
		{
			System.out.println(file.getName());
		    img = ImageIO.read(file); 
		} 
		catch (Exception e) 
		{
			e.printStackTrace();
		}
		return img;
	}
	public static void writeImage(BufferedImage toWrite, BufferedImage out, int start, int width, int height){
		int toWriteCurr = 0;
		for(int i=start;i<start+width;i++){
			for(int j = 0;j<height;j++){
				int rgb = toWrite.getRGB(toWriteCurr, j);
				out.setRGB(i, j, rgb);
				
			}
			toWriteCurr++;
		}
	}
}