let url = 'https://people.cs.umass.edu/~joydeepb/robot.jpg'; 
let robot = lib220.loadImageFromURL(url);

//  imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY ( img, func ) {
   let result = img.copy();
   
   for( let i = 0; i < img.height; ++i ){
     for (let j = 0; j < img.width; ++j ){
         result.setPixel(j, i, func( img ,j ,i ));
     }
   }
   return result;
 }

//  imageMask(img: Image, func: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask ( img, func, maskValue ) {
   function f( img, x, y ){
      if(func( img, x, y )){
         return maskValue;
      }
      else {
         return img.getPixel( x, y );
      }
   }
   
   return imageMapXY( img, f );
}
// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel ( img, x, y ){
    let count = 0;

    let curP = img.getPixel(x, y);
    count = 1;
    let rAvg = curP[0];
    let gAvg = curP[1];
    let bAvg = curP[2];
    if ( x-1 >= 0 ){
      ++count;
      let tempP = img.getPixel(x-1 ,y);
      rAvg = rAvg + tempP[0];
      gAvg = gAvg + tempP[1];
      bAvg = bAvg + tempP[2];
      if( y-1 >= 0 ){
        ++count;
        let tempP1 = img.getPixel(x-1, y-1);
        
        rAvg = rAvg + tempP1[0];
        gAvg = gAvg + tempP1[1];
        bAvg = bAvg + tempP1[2];
      }
      if( y+1 < img.height ){
        ++count;
        let tempP1 = img.getPixel(x-1, y+1);
        
        rAvg = rAvg + tempP1[0];
        gAvg = gAvg + tempP1[1];
        bAvg = bAvg + tempP1[2];
      }
    }
    if ( x+1 < img.width ){
      ++count;
      let tempP = img.getPixel(x+1 ,y);
      rAvg = rAvg + tempP[0];
      gAvg = gAvg + tempP[1];
      bAvg = bAvg + tempP[2];
      if( y-1 >= 0 ){
        ++count;
        let tempP1 = img.getPixel(x+1, y-1);
        
        rAvg = rAvg + tempP1[0];
        gAvg = gAvg + tempP1[1];
        bAvg = bAvg + tempP1[2];
      }
      if( y+1 < img.height ){
        ++count;
        let tempP1 = img.getPixel(x+1, y+1);
        
        rAvg = rAvg + tempP1[0];
        gAvg = gAvg + tempP1[1];
        bAvg = bAvg + tempP1[2];
      }
    }
    if ( y-1 >= 0) {
      ++count;
      let tempP1 = img.getPixel(x, y-1);
        
      rAvg = rAvg + tempP1[0];
      gAvg = gAvg + tempP1[1];
      bAvg = bAvg + tempP1[2];
    }
    if ( y+1 < img.height) {
      ++count;
      let tempP1 = img.getPixel(x, y+1);
        
      rAvg = rAvg + tempP1[0];
      gAvg = gAvg + tempP1[1];
      bAvg = bAvg + tempP1[2];
    }
    let blurP = [(rAvg / count) , (gAvg / count) , (bAvg / count)];
    
    return blurP;
}   

// blurImage(img: Image): Image
function blurImage ( img ) {
   return imageMapXY( img, blurPixel );
}


// blurHalfImage(img: Image, right: boolean): Image
function blurHalfImage ( img, right) {

   if(right){
      return imageMapXY( img, blurHalfImageHelperRight );
   }
   else {
      return imageMapXY( img, blurHalfImageHelperLeft );
   }
}

// blurHalfImageHelperRight (img: Image, x : number, y : number) : Pixel
function blurHalfImageHelperRight ( img, x, y ) {
   let edgeP = img.width/2;

   if(x >= edgeP){
      return blurPixel ( img, x, y );
   }
   else{
      return img.getPixel( x, y );
   }
}

// blurHalfImageHelperLeft (img: Image, x : number, y : number) : Pixel
function blurHalfImageHelperLeft ( img, x, y ) {
   let edgeP = img.width/2;

   if(x < edgeP){
      return blurPixel ( img, x, y );
   }
   else{
      return img.getPixel( x, y );
   }
}

// isGrayish(p: Pixel): boolean
function isGrayish (p){
   if (p[0] >= 0.3 && p[0] <= 0.7 && p[1] >= 0.3 && p[1] <= 0.7 && p[2] >= 0.3 && p[2] <= 0.7){
      return true;
   }
   else {
      return false;
   }
}

// toGrayscale(img: Image): Image
function toGrayscale ( img ){
   function f( img, x, y ){
      let p = img.getPixel( x, y );
      if(isGrayish(p)){
         let grayV = ( p[0] + p[1] + p[2] ) / 3;
         return [grayV, grayV, grayV];
      }
      else {
         return p;
      }
   }
   
   return imageMapXY( img, f );
}


// grayHalfImage(img: Image): Image
function grayHalfImage ( img ) {
   return imageMapXY( img, grayHalfImageHelper );
}

// grayHalfImageHelperRight (img: Image, x : number, y : number) : Pixel
function grayHalfImageHelper ( img, x, y ) {
   let edgeP = img.width/2;
   let p = img.getPixel( x, y );
   
   if( x >= edgeP ){
      let grayV = ( p[0] + p[1] + p[2] ) / 3;
      return [grayV, grayV, grayV];
   }
   else{
      return p;
   }
}

// saturateHigh(img: Image): Image
function saturateHigh ( img ){
   return imageMapXY ( img, saturateHighHelper );
}

// saturateHighHelper (img: Image, x : number, y : number) : Pixel
function saturateHighHelper ( img, x, y ) {
   let p = img.getPixel( x, y );
   let redV = p[0];
   let greenV = p[1];
   let blueV = p[2];
   if ( redV > 0.7 ){
      redV = 1.0;
   }
   if ( greenV > 0.7 ){
      greenV = 1.0;
   }
   if ( blueV > 0.7 ){
      blueV = 1.0;
   }
   return [ redV, greenV, blueV ];
}

// blackenLow(img: Image): Image
function blackenLow ( img ){
   return imageMapXY ( img, blackenLowHelper );
}

// blackenLowHelper (img: Image, x : number, y : number) : Pixel
function blackenLowHelper ( img, x, y ) {
   let p = img.getPixel( x, y );
   let redV = p[0];
   let greenV = p[1];
   let blueV = p[2];
   if ( redV < 0.3 ){
      redV = 0.0;
   }
   if ( greenV < 0.3 ){
      greenV = 0.0;
   }
   if ( blueV < 0.3 ){
      blueV = 0.0;
   }
   return [ redV, greenV, blueV ];
}

// imageMap(img : Image, func :( (curP : Pixel): Pixel)) : Image
function imageMap ( img, func ) {
   let result = img.copy();
   
   for( let i = 0; i < img.height; ++i ){
     for (let j = 0; j < img.width; ++j ){
         let curP = img.getPixel(j, i);
         result.setPixel(j, i, func( curP ));
     }
   }
   return result;
 }

// reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)
function reduceFunctions( fa ){
  
  function res (pix){
     // f(tot: Pixel , curr: (Pixel => Pixel)) : Pixel
     function f(tot, cur){
        return cur(tot);
     }  
     return fa.reduce(f, pix);
  }
  return res
}

// colorize(img: Image): Image
function colorize( img ){
   function f1( p ){
      if(isGrayish(p)){
         let grayV = ( p[0] + p[1] + p[2] ) / 3;
         return [grayV, grayV, grayV];
      }
      else {
         return p;
      }
   }

   function f2 ( p ) {
   let redV = p[0];
   let greenV = p[1];
   let blueV = p[2];
   if ( redV < 0.3 ){
      redV = 0.0;
   }
   if ( greenV < 0.3 ){
      greenV = 0.0;
   }
   if ( blueV < 0.3 ){
      blueV = 0.0;
   }
   return [ redV, greenV, blueV ];
}

   function f3 ( p ) {
   let redV = p[0];
   let greenV = p[1];
   let blueV = p[2];
   if ( redV > 0.7 ){
      redV = 1.0;
   }
   if ( greenV > 0.7 ){
      greenV = 1.0;
   }
   if ( blueV > 0.7 ){
      blueV = 1.0;
   }
   return [ redV, greenV, blueV ];
}

   let finalFunc = reduceFunctions( [ f1, f2, f3 ] );
   return imageMap( img, finalFunc );
}


//colorize(robot).show()


test('imageMapXY function definition is correct', function() { let identityFunction = function(image, x, y) {
return image.getPixel(x, y); };
let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
let outputImage = imageMapXY(inputImage, identityFunction);
// Output should be an image, so getPixel must work without errors. 
let p = outputImage.getPixel(0, 0);
assert(p[0] === 0);
assert(p[1] === 0);
assert(p[2] === 0);
assert(inputImage !== outputImage);
});

function pixelEq (p1, p2) {
   const epsilon = 0.002;
   for (let i = 0; i < 3; ++i) {
      if (Math.abs(p1[i] - p2[i]) > epsilon) {
      return false;
      }
   }
   return true;
}

test('identity function with imageMapXY', function() {
   let identityFunction = function(image, x, y ) {
      return image.getPixel(x, y);
   };
   let inputImage = lib220.createImage(10, 10, [ 0.2, 0.2, 0.2]);
   inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
   inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]); 
   inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
   let outputImage = imageMapXY(inputImage, identityFunction);
   assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5])); 
   assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3])); 
   assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8])); 
   assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});