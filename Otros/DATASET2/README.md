# Northwind (CSV & JSON)

This repository contains **CSV** and **JSON** exports of the classic **Microsoft Northwind** relational sample database. It is intended for testing data exploration agents and answer natural-language questions over structured data.

## Example exploration queries

Below is a list of natural-language prompts you can use to benchmark or smoke-test agents over this dataset:

```python
EXAMPLE_QUERIES = [
    "Which customers from Germany have placed orders shipped by Federal Shipping?",
    "Find all orders placed by customers in London and show the employee name who handled each order.",
    "What is the total value of all orders placed by Alfreds Futterkiste (calculate quantity × unitPrice)?",
    "List all Beverages products supplied by companies from the UK.",
    "Which products in the Confections category are currently discontinued?",
    "Find all suppliers that provide products in the Dairy Products category and show how many products each supplies.",
    "Which employees work in territories in the Eastern region?",
    "List all orders handled by employees who report to Andrew Fuller.",
    "Find employees who work in multiple territories and show their territory count.",
    "Which products were ordered in July 1996 and what categories do they belong to?",
    "Find orders shipped to Brazil and list all products included with their supplier information.",
    "What is the average freight cost for orders shipped by each shipper to customers in France?",
    "Which suppliers provide the top 5 most frequently ordered products?",
    "Find all orders containing products from Tokyo Traders and show the customer names.",
    "What percentage of each category's products are discontinued?",
    "Which employee handled orders with the highest total freight costs and what territories do they cover?",
    "Find all Sales Representatives who have processed orders for customers in Mexico.",
    "List all orders shipped to the same country as the supplier's country for the products in that order.",
    "Which regions have employees who processed orders shipped to countries outside the USA?",
    "Find customers who ordered products that have a reorder level above 20 and show which categories these products belong to.",
]
```

## License / provenance

Northwind is a well-known sample database; this repo only redistributes tabular exports in open formats for local testing.
