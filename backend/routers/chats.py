from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
from ..models import User, Chat, Message, MessageRole
from ..schemas import (
    ChatCreate, 
    ChatUpdate, 
    ChatResponse, 
    ChatDetailResponse,
    MessageCreate,
    MessageResponse
)
from ..auth import get_current_active_user
from ..database import get_db
import json
import os

# Import the LAW QA chain from streamlit_app logic
_rag_available = True

router = APIRouter(prefix="/chats", tags=["chats"])

# Initialize RAG components
_qa_chain = None
_embeddings = None

def get_qa_chain():
    """Initialize and cache the QA chain"""
    global _qa_chain, _embeddings
    
    if not _rag_available:
        return None
    
    if _qa_chain is None:
        try:
            # Lazy import RAG dependencies
            from langchain_core.prompts import PromptTemplate
            try:
                from langchain_openai import ChatOpenAI, OpenAIEmbeddings
            except ImportError:
                from langchain_community.chat_models import ChatOpenAI
                from langchain_community.embeddings import OpenAIEmbeddings
            try:
                from langchain_huggingface import HuggingFaceEmbeddings
            except ImportError:
                from langchain_community.embeddings import HuggingFaceEmbeddings
            try:
                from langchain_chroma import Chroma
            except ImportError:
                from langchain_community.vectorstores import Chroma
            
            from ..config import get_settings
            settings = get_settings()
            
            # Initialize embeddings using OpenAI with 768 dimensions to match existing vectors
            print("🔄 Initializing OpenAI embeddings (768 dims)...")
            try:
                _embeddings = OpenAIEmbeddings(model="text-embedding-3-small", dimensions=768)  # type: ignore
            except Exception as e:
                print(f"⚠️ OpenAI embeddings error: {e}, falling back to HuggingFace...")
                _embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")  # type: ignore
            
            # Load vector database
            vectordb = Chroma(  # type: ignore
                persist_directory=settings.VECTOR_DB_PATH,
                embedding_function=_embeddings,
            )
            
            # Create retriever
            retriever = vectordb.as_retriever(search_kwargs={"k": 5})
            
            # Test retriever with a sample query to verify it works
            try:
                test_results = retriever.invoke("Nepal law")
                print(f"✅ Retriever test: Found {len(test_results)} documents")
                if test_results:
                    print(f"   Sample doc: {test_results[0].page_content[:100]}...")
            except Exception as e:
                print(f"⚠️ Retriever test result: {e}")
            
            # Create LLM
            llm = ChatOpenAI(  # type: ignore
                model="gpt-4o-mini",
                temperature=0.1
            )
            
            # Create prompt template - matching Streamlit app logic
            template = """You are 'Nepal Law AI', a helpful legal assistant who is only able to answer questions about Nepal's legal system. Format your response clearly and professionally in a short, concise manner (under 100 words) unless the user asks for detailed information.

INSTRUCTIONS:
- CRITICAL: Only answer questions related to Nepal's legal system, including laws, punishments, rights, and legal procedures. If the question is not about Nepal law, politely decline to answer.
- CRITICAL: Use markdown formatting for readability
- CRITICAL: Always include relevant **Act names**, **Section numbers**, and **Article references** when applicable
- Start with a clear, direct answer in 1-2 sentences
- Use bullet points (• or -) for listing key points or categories
- Use bold (**text**) for important terms, Acts, and Sections
- For punishments or consequences, use a separate line with clear formatting
- Keep responses concise but well-organized
- End with a complete full stop

Context: {context}
Question: {question}

Response:"""
            
            prompt = PromptTemplate(  # type: ignore
                input_variables=["context", "question"],
                template=template
            )
            
            # Create a simple retrieval chain using LCEL (Langchain Expression Language)
            def format_docs(docs):
                return "\n\n".join(doc.page_content for doc in docs)
            
            def format_input(question):
                """Format the question into the required input dict"""
                docs = retriever.invoke(question)
                context = format_docs(docs)
                return {"context": context, "question": question}
            
            _qa_chain = (
                format_input
                | prompt
                | llm
            )
            print("✅ QA chain initialized successfully")
        except Exception as e:
            print(f"❌ Error initializing QA chain: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    return _qa_chain

@router.post("", response_model=ChatResponse)
async def create_chat(
    chat_data: ChatCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session"""
    print(f"📝 Creating new chat for user {current_user.username}: {chat_data.title}")
    
    new_chat = Chat(
        user_id=current_user.id,
        title=chat_data.title,
        description=chat_data.description
    )
    
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    
    print(f"✅ Chat created with ID {new_chat.id}")
    return new_chat

@router.get("", response_model=List[ChatResponse])
async def list_chats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    archived: bool = False
):
    """List all chats for current user"""
    
    chats = db.query(Chat).filter(
        Chat.user_id == current_user.id,
        Chat.is_archived == archived
    ).order_by(Chat.updated_at.desc()).all()
    
    print(f"📋 Retrieved {len(chats)} chats for user {current_user.username}")
    return chats
    return chats

@router.get("/{chat_id}", response_model=ChatDetailResponse)
async def get_chat(
    chat_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific chat with all its messages"""
    
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    return chat

@router.put("/{chat_id}", response_model=ChatResponse)
async def update_chat(
    chat_id: int,
    chat_data: ChatUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a chat"""
    
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    if chat_data.title:
        chat.title = chat_data.title  # type: ignore
    if chat_data.description is not None:
        chat.description = chat_data.description  # type: ignore
    if chat_data.is_archived is not None:
        chat.is_archived = chat_data.is_archived  # type: ignore
    
    db.commit()
    db.refresh(chat)
    
    return chat

@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a chat"""
    
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    db.delete(chat)
    db.commit()
    
    return {"message": "Chat deleted successfully"}

@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def create_message(
    chat_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    print(f"📨 Received message from user {current_user.username} in chat {chat_id}: {message_data.content[:50]}...")
    
    # Verify chat belongs to user
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        print(f"❌ Chat {chat_id} not found for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    # Save user message
    user_message = Message(
        chat_id=chat_id,
        user_id=current_user.id,
        content=message_data.content,
        role=MessageRole.USER
    )
    
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    print(f"✅ User message saved with ID {user_message.id}")
    
    # Determine if this is a legal query
    query_lower = message_data.content.lower().strip()
    law_triggers = ["law", "nepal", "punishment", "jail", "crime", "harass", "illegal", "rights", "constitution", "act", "section", "article"]
    is_legal_query = any(word in query_lower for word in law_triggers)
    
    # Get AI response
    ai_content = None
    
    if _rag_available:
        try:
            if is_legal_query:
                print("🤖 Processing legal query with RAG...")
                qa_chain = get_qa_chain()
                if qa_chain:
                    print(f"📚 Querying with: {message_data.content}")
                    response = qa_chain.invoke(message_data.content)
                    # Extract content from AIMessage or string response
                    if hasattr(response, 'content'):
                        ai_content = response.content
                    else:
                        ai_content = str(response)
                    print(f"✅ AI response generated: {ai_content[:50]}...")
                else:
                    ai_content = "Legal database not available. Please try again later."
            else:
                print("💬 Processing general query with LLM...")
                # For non-legal queries, use direct LLM (no RAG) with conversational system prompt
                try:
                    from langchain_openai import ChatOpenAI
                except ImportError:
                    from langchain_community.chat_models import ChatOpenAI
                
                from langchain_core.messages import SystemMessage, HumanMessage
                
                llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
                system_msg = SystemMessage(content="You are 'Nepal Law AI', a helpful chat assistant. I'm primarily specialized in helping with questions about Nepal's legal system, laws, and legal procedures. Feel free to chat with me about other topics too, but my expertise is in Nepal law.")
                user_msg = HumanMessage(content=message_data.content)
                response = llm.invoke([system_msg, user_msg])
                ai_content = response.content
                print(f"✅ General response generated: {ai_content[:50]}...")
        except Exception as e:
            print(f"❌ AI Error: {str(e)}")
            ai_content = f"Error processing query: {str(e)[:100]}"
    else:
        print("⚠️ RAG system not available")
        ai_content = "AI response system not available. Please check your configuration."
    
    # Save AI response
    ai_message = Message(
        chat_id=chat_id,
        user_id=current_user.id,
        content=ai_content,
        role=MessageRole.ASSISTANT
    )
    
    db.add(ai_message)
    
    # Update chat title if it's the first message
    if len(chat.messages) == 1:  # Only user message so far
        chat.title = message_data.content[:50] + ("..." if len(message_data.content) > 50 else "")  # type: ignore
    
    db.commit()
    db.refresh(ai_message)
    print(f"✅ Message flow complete for chat {chat_id}")
    
    return ai_message

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    chat_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all messages in a chat"""
    
    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    messages = db.query(Message).filter(
        Message.chat_id == chat_id
    ).order_by(Message.created_at.asc()).all()
    
    return messages
