import mongoose from 'mongoose'

async function logDocumentsInCollections (): Promise<void> {
  const collections = await mongoose.connection.db?.listCollections().toArray();
    
  if (collections) {
    for (const col of collections) {
      console.log(`\n Collection: ${col.name}`);
  
      const model = mongoose.connection.collection(col.name);
      const documents = await model.find().toArray();
  
      if (documents.length === 0) {
        console.log("No documents found.");
      } else {
        console.log("Documents:");
        documents.forEach((doc, index) => {
          console.log(`${index + 1}.`, JSON.stringify(doc, null, 2));
        });
      }
    }
  }
}

export { logDocumentsInCollections }