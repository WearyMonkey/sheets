export class FileUploader {

  upload(file: File, progress: (uploaded: number, total: number) => void): Promise<string> {
    const bucketUrl = 'https://s3-ap-southeast-2.amazonaws.com/sheets-uploads';
    const key = `${Date.now()}_${file.name}`;
    const imageUrl = `${bucketUrl}/${key}`;
    const oReq = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('key', key);
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      oReq.upload.onprogress = e => progress(e.loaded, e.total);
      oReq.addEventListener("load", () => resolve(imageUrl));
      oReq.addEventListener("error", reject);
      oReq.addEventListener("abort", reject);
      oReq.open("post", bucketUrl);
      oReq.send(formData);
    })
  }
}