import Newspaper from '/home/godlord/news/newsapp/models/Newspaper..js';
import NewspaperDate from '/home/godlord/news/newsapp/models/NewspaperDate..js';
import PdfFile from '/home/godlord/news/newsapp/models/PdfFile..js';

// Associations
Newspaper.hasMany(NewspaperDate, { foreignKey: 'newspaper_id' });
Newspaper.hasMany(PdfFile, { foreignKey: 'newspaper_id' });
NewspaperDate.belongsTo(Newspaper, { foreignKey: 'newspaper_id' });
PdfFile.belongsTo(Newspaper, { foreignKey: 'newspaper_id' });

export { Newspaper, NewspaperDate, PdfFile };
