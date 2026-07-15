import sys
import pymupdf4llm

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf.py <path_to_pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    
    try:
        # Convert the PDF to Markdown text using PyMuPDF4LLM
        md_text = pymupdf4llm.to_markdown(pdf_path)
        print(md_text)
    except Exception as e:
        print(f"Error processing PDF: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
