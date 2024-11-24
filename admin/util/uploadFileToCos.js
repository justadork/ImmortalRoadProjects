import COS from "cos-js-sdk-v5";
import SparkMD5 from "spark-md5";

export async function uploadFileToCos(name, file) {
 return new Promise(res => {
  const ext = file.name.split('.')[file.name.split('.').length - 1]
  const fileReader = new FileReader();
  const spark = new SparkMD5.ArrayBuffer();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = async function (e) {
   spark.append(e.target.result);
   const md5 = spark.end(null)
   const cos = new COS({
    SecretId: 'AKIDkSXcjqvtkaGrO5nRzcL3hTBoNp5GlBVg',
    SecretKey: '78GVk4Mix69scICteLuXK3v5LXov39Wr',
   })
   const result = await cos.putObject({
    Bucket: 'immortal-road-1307475432',
    Region: 'ap-guangzhou',
    Key: md5 + '.' + ext,
    Body: file, // 上传文件对象
   });
   res('https://' + result.Location)
  }
 })
}