"""Database connection and knowledge graph initialization."""
import sqlite3
import logging

import networkx as nx

from cannalchemy.data.schema import init_db
from cannalchemy.data.graph import build_knowledge_graph
from backend.app.config import DB_PATH

logger = logging.getLogger(__name__)


class Database:
    """Holds the SQLite connection and NetworkX graph."""

    def __init__(self):
        self.conn: sqlite3.Connection | None = None
        self.graph: nx.DiGraph | None = None

    def initialize(self, db_path: str = DB_PATH):
        """Open database and build knowledge graph."""
        logger.info(f"Initializing database from {db_path}")
        self.conn = init_db(db_path)
        self.conn.row_factory = sqlite3.Row

        # Count strains
        strain_count = self.conn.execute(
            "SELECT COUNT(DISTINCT s.id) FROM strains s "
            "JOIN strain_compositions sc ON s.id = sc.strain_id"
        ).fetchone()[0]

        logger.info(f"Building knowledge graph from {strain_count} strains...")
        self.graph = build_knowledge_graph(self.conn)
        logger.info(
            f"Graph built: {self.graph.number_of_nodes()} nodes, "
            f"{self.graph.number_of_edges()} edges"
        )

    def close(self):
        if self.conn:
            self.conn.close()
            self.conn = None
            self.graph = None


# Singleton instance
db = Database()
