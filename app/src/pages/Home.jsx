const Home = () => {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold my-8 text-justify">
        Welcome to US Baby Names Visualization
      </h1>

      <section className="w-full md:w-2/3 lg:w-1/2 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-justify">
          Getting Started
        </h2>
        <p className="text-lg text-justify">
          To start exploring, use the navigation menu to select a feature. Each
          section provides interactive charts and tools to help you dive deep
          into the data.
        </p>
      </section>

      <section className="w-full md:w-2/3 lg:w-1/2 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-justify">
          About This App
        </h2>
        <p className="text-lg text-justify">
          This application provides visualizations of baby names in the United
          States using data from the{" "}
          <a
            href="https://www.kaggle.com/datasets/kaggle/us-baby-names"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:animate-pulse"
          >
            US Baby Names dataset
          </a>
          . You can explore trends over time, compare popularity across
          different names, and discover interesting insights about naming
          patterns.
        </p>
      </section>

      <section className="w-full md:w-2/3 lg:w-1/2 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-justify">
          Dataset Information
        </h2>
        <p className="text-lg text-justify">
          The dataset contains information about baby names in the United
          States, including:
        </p>
        <ul className="list-disc list-inside text-lg text-justify">
          <li>Names and their frequencies by year</li>
          <li>Gender of the babies with each name</li>
          <li>Trends over time</li>
          <li>Regional popularity</li>
        </ul>
        <p className="text-lg mt-4 text-justify">
          This rich dataset allows us to create a variety of visualizations to
          help understand naming trends and preferences.
        </p>
      </section>

      <section className="w-full md:w-2/3 lg:w-1/2 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-justify">Features</h2>
        <p className="text-lg text-justify">
          Currently, the app offers the following features:
        </p>
        <ul className="list-disc list-inside text-lg text-justify">
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
