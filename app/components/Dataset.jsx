import React from "react";

const DatasetTable = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dataset</h2>
      <table className="table-dataset min-w-full border-collapse block md:table border ">
        <thead className="block md:table-header-group">
          <tr className="border border-black md:border-none block md:table-row">
            <th className="block md:table-cell p-2 border border-black">ID</th>
            <th className="block md:table-cell p-2 border border-black">Title</th>
            <th className="block md:table-cell p-2 border border-black">Channel</th>
            <th className="block md:table-cell p-2 border border-black">Url</th>
            <th className="block md:table-cell p-2 border border-black">Tags</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetTable;
