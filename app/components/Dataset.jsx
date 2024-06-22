import React, { useState } from "react";
import { Parser } from "json2csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DatasetTable = ({ data, isTranscriptData }) => {
  const [showMore, setShowMore] = useState(Array(data.length).fill(false));
  const [exportType, setExportType] = useState("");

  const handleShowMore = (index) => {
    setShowMore((prev) => {
      const newShowMore = [...prev];
      newShowMore[index] = !newShowMore[index];
      return newShowMore;
    });
  };

  const handleExport = () => {
    if (exportType === "csv") {
      exportToCSV();
    } else if (exportType === "excel") {
      exportToExcel();
    }
  };

  // const preprocessData = (data) => {
  //   return data.map(item => ({
  //     ...item,
  //     tags: item.tags.map(tag => `${tag[0]}(${tag[1]})`).join(', '), // Đảm bảo đúng cách
  //     transcripts: isTranscriptData ? item.transcripts.map(transcript => 
  //       `${transcript.text} (Start: ${transcript.start}, Emotions: ${transcript.emotions.map(e => `${e.name} (${e.score})`).join(', ')})`
  //     ).join(' | ') : null  // Đây là cách chính xác để sử dụng template strings
  //   }));
  // };

  const preprocessData = (data) => {
    return data.map(item => ({
      ...item,
      tags: item.tags.map(tag => `${tag[0]}(${tag[1]})`).join(', '), // Xuất dạng chuỗi thông thường
      transcripts: isTranscriptData ? item.transcripts.map(transcript =>
        `"${transcript.text} (Start: ${transcript.start}, Emotions: ${transcript.emotions.map(e => `${e.name} (${e.score})`).join(', ')})"`.replace(/(\r\n|\n|\r)/gm, "")
      ).join('\n') : null  // Sử dụng "\n" để xuống hàng và bao quanh bởi dấu nháy kép
    }));
  };

  const setCellFormat = (ws, cellRef) => {
    if (ws[cellRef]) {
      ws[cellRef].s = {
        alignment: {
          wrapText: true, // Set thuộc tính wrapText cho ô
        },
      };
    }
  }

  const exportToCSV = () => {
    const fields = ['_id', 'title', 'channel', 'url', 'tags'];
    if (isTranscriptData) {
      fields.push('transcripts');
    }
    const opts = { fields };
    const parser = new Parser(opts);
    const preprocessedData = preprocessData(data).map(item => {
      if (!isTranscriptData) {
        const { transcripts, ...rest } = item;
        return rest;
      }
      return item;
    });
    const csv = parser.parse(preprocessedData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'dataset.csv');
  };

  const exportToExcel = () => {
    const preprocessedData = preprocessData(data).map(item => {
      if (!isTranscriptData) {
        const { transcripts, ...rest } = item;
        return rest;
      }
      return item;
    });
    const ws = XLSX.utils.json_to_sheet(preprocessedData);
    preprocessedData.forEach((item, index) => {
      const cellRef = XLSX.utils.encode_cell({ c: 6, r: index + 1 }); // Thay thế <Cột transcripts> bằng số cột thực sự của cột transcripts
      setCellFormat(ws, cellRef);
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dataset');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'dataset.xlsx');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Dataset</h2>
        <div className="flex items-center">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="mr-2 px-4 py-2 border rounded"
          >
            <option value="" disabled>Select export type</option>
            <option value="csv">Export to CSV</option>
            <option value="excel">Export to Excel</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={!exportType}
          >
            Export
          </button>
        </div>
      </div>
      <table className="table-dataset min-w-full border-collapse block md:table border">
        <thead className="block md:table-header-group">
          <tr className="border border-black md:border-none block md:table-row">
            <th className="block md:table-cell p-2 border border-black">ID</th>
            <th className="block md:table-cell p-2 border border-black">Title</th>
            <th className="block md:table-cell p-2 border border-black">Channel</th>
            <th className="block md:table-cell p-2 border border-black">Url</th>
            <th className="block md:table-cell p-2 border border-black">Tags</th>
            {isTranscriptData && (
              <th className="block md:table-cell p-2 border border-black">
                Transcript with Emotion
              </th>
            )}
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {data?.map((item, index) => (
            <tr key={index} className="border border-black md:border-none block md:table-row">
              <td className="block md:table-cell p-2 border border-black">{item._id}</td>
              <td className="block md:table-cell p-2 border border-black">{item.title}</td>
              <td className="block md:table-cell p-2 border border-black">{item.chanel}</td>
              <td className="block md:table-cell p-2 border border-black">
                <a href={item.url} className="text-blue-600">{item.url}</a>
              </td>
              <td className="block md:table-cell p-2 border border-black">{JSON.stringify(item.tags)}</td>
              {isTranscriptData && (
                <td className="block md:table-cell p-2 border border-black">
                  {item.transcripts ? (
                    <div style={{ display: showMore[index] ? 'block' : '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.transcripts.map((transcript, tindex) => (
                        <div key={tindex} className="mb-2">
                          <div className="font-semibold">Text: {transcript.text}</div>
                          <div className="text-gray-600">Start: {transcript.start}</div>
                          <div className="text-gray-600">Emotions: {transcript.emotions.map(emotion => `${emotion.name} (${emotion.score})`).join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {item.transcripts && (
                    <button onClick={() => handleShowMore(index)} className="text-blue-600">
                      {showMore[index] ? "Show Less" : "Show More"}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetTable;


