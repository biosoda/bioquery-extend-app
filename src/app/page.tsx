'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space, Divider, Row, Col } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';

const sampleData = {
  serviceUrl: 'https://www.bgee.org/sparql',
  question: 'List the labels and identifiers of $$fruitfly$$ genes in bgee',
  query: `PREFIX up: <http://purl.uniprot.org/core/>
PREFIX orth: <http://purl.org/net/orth#>
PREFIX obo: <http://purl.obolibrary.org/obo/>
SELECT distinct ?gene_page ?geneName {
	?gene a orth:Gene .
	?gene rdfs:seeAlso ?gene_page .
	?gene rdfs:label ?geneName .
	?gene orth:organism ?taxon .
	?taxon obo:RO_0002162 ?species .
	?species up:commonName ?commonName .
	FILTER (lcase(str(?commonName)) = lcase("$$fruitfly$$")) .
}
`,
};

const Home = () => {
  const [form] = Form.useForm();
  const [question, setQuestion] = useState('');
  const [sparqlQuery, setSparqlQuery] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  const codeMirror = {
    extensions: [langs.sparql()],
    options: {
      lineNumbers: true,
    },
  };

  const tooltip = 'Define editable fields with double dollar sign enclosures, e.g. $$editable-field$$';

  const handleSubmit = async () => {
    if (!question || !sparqlQuery || !serviceUrl) {
      setAlert({ type: 'error', message: 'Please fill in all mandatory fields.' });
      return;
    }

    try {
      let formContent = JSON.stringify({
        question,
        sparqlQuery,
        serviceUrl,
        name,
        email,
      });
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formContent,
      });

      const result = await response.json();

      if (result.error) {
        setAlert({ type: 'error', message: 'An error has occured.' });
      } else {
        handleReset();
        setAlert({ type: 'success', message: 'The question has been submitted.' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleReset = () => {
    setQuestion('');
    setSparqlQuery('');
    setServiceUrl('');
    setName('');
    setEmail('');
    setAlert({ type: '', message: '' });
  };

  const handlePrefill = () => {
    setQuestion(sampleData.question);
    setSparqlQuery(sampleData.query);
    setServiceUrl(sampleData.serviceUrl);
  };

  return (
    <main>
      <Form form={form} layout="vertical" requiredMark="optional" className="query-form" onFinish={handleSubmit}>
        {alert.message && (
          <Alert type={alert.type as 'error' | 'success' | 'info' | 'warning' | undefined} message={alert.message} />
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Question" tooltip={tooltip} required>
              <Input.TextArea
                rows={5}
                value={question}
                style={{ resize: 'none' }}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="SPARQL Query" tooltip={tooltip} required>
              <CodeMirror
                value={sparqlQuery}
                basicSetup={codeMirror.options}
                extensions={codeMirror.extensions}
                className="sparql-editor"
                onChange={(e) => setSparqlQuery(e)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Service URL" required>
              <Input value={serviceUrl} onChange={(e) => setServiceUrl(e.target.value)} />
            </Form.Item>
            <Form.Item label="Author Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Author Email">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button" onClick={handleReset}>
                  Reset
                </Button>
                <Button htmlType="button" onClick={handlePrefill}>
                  Prefill
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </main>
  );
};

export default Home;
