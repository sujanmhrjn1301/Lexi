# Nepal Law AI Agent: Lexi

An intelligent legal assistance application that provides accessible legal information about Nepali laws. This app uses AI-powered retrieval-augmented generation (RAG) to answer questions about Nepal's legal system.

## Features

✨ **AI-Powered Legal Queries**
- Ask questions about Nepali laws and get instant answers
- Intelligent distinction between legal and general queries
- Context-aware responses using a local law database

📚 **Vector Database Integration**
- ChromaDB vector database for efficient legal document retrieval
- HuggingFace embeddings for semantic search
- Support for 768-dimensional embeddings (OpenAI/Local DB compatible)

🔍 **Smart Query Recognition**
- Automatically detects legal questions
- Provides legal database searches for law-related queries
- General responses for non-legal questions

📋 **Review Queue System**
- Staging system for AI-generated legal summaries
- Track pending review items
- JSON-based queuing for easy management

## Installation

### Prerequisites
- Python 3.8+
- OpenAI API Key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lexi
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   # or
   source venv/bin/activate  # On macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Prepare the vector database**
   
   Ensure the `nepal_law_db/` directory exists with your ChromaDB database. If you don't have one, you'll need to create it using the data preparation scripts:
   ```bash
   python vectorize_data.py
   ```

## Usage

### Running the Application

```bash
streamlit run streamlit_app.py
```

The app will open in your browser at `http://localhost:8501`

### Using the App

1. **Ask Legal Questions**
   - Type your question about Nepali laws
   - The app automatically detects if it's a legal question
   - Get AI-generated answers with relevant database context

2. **Review Queue**
   - Monitor pending AI-generated summaries
   - Check the sidebar for review queue status
   - Access reviewed items in `processed_json/review_queue.json`

3. **System Status**
   - View database connection status in the sidebar
   - Monitor processing time for queries
   - Track review queue items

## Project Structure

```
├── streamlit_app.py              # Main application
├── requirements.txt              # Python dependencies
├── .env                         # Environment variables (create this)
├── README.md                    # This file
│
├── data/                        # Raw data files
├── nepal_law_db/                # ChromaDB vector database
│   ├── chroma.sqlite3
│   └── c1138279-14ad-4586-9e50-c16f278a19a9/
│
├── processed_json/
│   └── review_queue.json        # Pending review summaries
│
├── vectorize_data.py            # Script to create embeddings
├── Structural_Chunking.py       # Document chunking utilities
├── clean_text.py                # Text preprocessing
├── add_criminal_law.py           # Criminal law data addition
└── chat_with_law.py             # Legacy chat interface
```

## Configuration

### Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key for GPT-4o-mini model

**Optional:**
- Configure Streamlit settings in `.streamlit/config.toml` if needed

### Customization

Edit `streamlit_app.py` to modify:
- **LLM Model**: Change `model_name="gpt-4o-mini"` to use a different model
- **Temperature**: Adjust `temperature=0.1` for more/less creative responses
- **Embedding Model**: Change `model_name="sentence-transformers/all-mpnet-base-v2"`
- **Database Path**: Modify `DB_DIR = "./nepal_law_db"`

## Key Technologies

- **[Streamlit](https://streamlit.io/)** - Web app framework
- **[LangChain](https://www.langchain.com/)** - LLM orchestration
- **[OpenAI ChatGPT](https://openai.com/)** - Language model
- **[ChromaDB](https://www.trychroma.com/)** - Vector database
- **[HuggingFace](https://huggingface.co/)** - Embeddings (all-mpnet-base-v2)
- **[sentence-transformers](https://sbert.net/)** - Text embedding

## API & Database

### Vector Database
- **Engine**: ChromaDB (local SQLite)
- **Embeddings**: 768-dimensional HuggingFace embeddings
- **Retrieval**: Top 2 most relevant documents per query

### LLM
- **Model**: GPT-4o-mini (cost-optimized)
- **Temperature**: 0.1 (deterministic responses)
- **Max Tokens**: Configurable per request

## Troubleshooting

### No secrets found error
- Ensure `.env` file exists with `OPENAI_API_KEY`
- Run: `pip install python-dotenv`
- Restart the Streamlit app

### Database not found
- Create `nepal_law_db` directory with ChromaDB data
- Or run: `python vectorize_data.py` to create embeddings

### Module import errors
- Reinstall dependencies: `pip install -r requirements.txt`
- Restart Python kernel

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature/your-feature`
6. Submit a pull request

## License

[Specify your license here]

## Support

For questions or issues:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Contact: [your-contact-info]

## Acknowledgments

- Nepali Law Database
- LangChain community
- OpenAI API
- Streamlit team

---

**Version**: 3.3 (768-Dim Compatible)  
**Last Updated**: April 2, 2026
